import { useCallback, useState } from 'react';
import { b2bAPI } from '@/services/b2bService';
import { useNotification } from '@/context/NotificationContext';
import { validateEdit, validateRenew, validateUpgrade } from '../utils/contractValidators';

const toPayload = (form) => ({
  name: form.name,
  status: form.status,
  startDate: form.startDate,
  endDate: form.endDate,
  maxEvents: form.isUnlimited ? 0 : Number(form.maxEvents),
  isUnlimited: Boolean(form.isUnlimited),
});

const useContractActions = (refresh) => {
  const { success, error: notifyError } = useNotification();
  const [processing, setProcessing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const run = useCallback(async (task, okMessage) => {
    setProcessing(true);
    try {
      const result = await task();
      setFieldErrors({});
      success(okMessage);
      if (refresh) await refresh();
      return { success: true, data: result };
    } catch (err) {
      notifyError(err?.message || 'Operacion de contrato fallida');
      return { success: false, error: err };
    } finally {
      setProcessing(false);
    }
  }, [refresh, success, notifyError]);

  const editContract = useCallback((contractId, form) => {
    const { valid, errors } = validateEdit(form);
    if (!valid) {
      setFieldErrors(errors);
      notifyError('Revisa los campos del contrato antes de guardar');
      return Promise.resolve({ success: false, errors });
    }
    return run(() => b2bAPI.updateContract(contractId, toPayload(form)), 'Contrato actualizado correctamente');
  }, [run, notifyError]);

  const upgradePackage = useCallback((contract, form) => {
    const { valid, errors } = validateUpgrade(contract, form);
    if (!valid) {
      setFieldErrors(errors);
      notifyError('La mejora de paquete no cumple las reglas de negocio');
      return Promise.resolve({ success: false, errors });
    }
    return run(
      () => b2bAPI.upgradePackage(contract.id, { ...toPayload({ ...contract, ...form }), organizationId: contract.organization?.id ?? contract.organizationId }),
      'Paquete mejorado correctamente',
    );
  }, [run, notifyError]);

  const renewContract = useCallback((source, form, options = {}) => {
    const { valid, errors } = validateRenew(source, form);
    if (!valid) {
      setFieldErrors(errors);
      notifyError('La renovacion no cumple las reglas de vigencia');
      return Promise.resolve({ success: false, errors });
    }
    const transferStaff = options.transferStaff !== false;
    const staffToCarry = transferStaff && Array.isArray(options.staffToCarry) ? options.staffToCarry : [];
    return run(async () => {
      const created = await b2bAPI.renewContract({
        ...toPayload(form),
        organizationId: source.organization?.id ?? source.organizationId,
        sourceContractId: source.id,
        managerId: options.managerId ?? source.manager?.id ?? source.managerId,
      });
      const newId = created?.id ?? created?.contract?.id ?? created?.data?.id;
      if (!newId) {
        await b2bAPI.updateContract(source.id, { status: 'FINISHED' });
        return created;
      }
      await b2bAPI.updateContract(source.id, { status: 'FINISHED' });
      if (transferStaff && staffToCarry.length > 0) {
        for (const entry of staffToCarry) {
          const userId = entry.userId ?? entry.user_id ?? entry.id;
          if (userId === undefined || userId === null) continue;
          try {
            await b2bAPI.assignContractManager({
              contractId: newId,
              userId,
              roleInContract: entry.roleInContract || entry.role || 'MANAGER',
            });
          } catch {
            continue;
          }
        }
        return created;
      }
      return created;
    }, 'Contrato renovado con nuevo folio');
  }, [run, notifyError]);

  return { processing, fieldErrors, editContract, upgradePackage, renewContract, clearErrors: () => setFieldErrors({}) };
};

export default useContractActions;
