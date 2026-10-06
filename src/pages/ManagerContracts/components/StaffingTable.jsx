import React from 'react';
import { Button, Table } from '@/components';

const StaffingTable = ({ columns, data, loading, emptyMessage }) => {
  if (loading) return <p className="mgrc-empty">Cargando personal...</p>;
  if (!data || data.length === 0) return <p className="mgrc-empty">{emptyMessage}</p>;
  return <Table columns={columns} data={data} />;
};

export const ACCESS_HINTS = {
  OPERADOR: 'Operacion de eventos del contrato',
  OPERATOR: 'Operacion de eventos del contrato',
  USUARIO: 'Acceso base a eventos del contrato',
  MANAGER: 'Gestion total del contrato y sus eventos',
};

export const AssignedStaffingTable = ({ data, loading, actionLoading, onUnassign }) => {
  const columns = [
    {
      key: 'userId',
      header: 'ID',
      render: (_, row) => row.userId ?? row.user_id ?? row.id,
    },
    {
      key: 'userName',
      header: 'Nombre',
      render: (_, row) => row.userName || row.user_name || row.email || `ID ${row.userId ?? ''}`,
    },
    {
      key: 'roleInContract',
      header: 'Rol y acceso',
      render: (value, row) => {
        const role = row.roleInContract || row.role || value || 'N/A';
        const hint = ACCESS_HINTS[String(role).toUpperCase()] || 'Acceso segun rol del contrato';
        return (
          <span title={hint}>
            {role} — {hint}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, row) => {
        const userId = row.userId ?? row.user_id ?? row.id;
        return (
          <Button size="small" variant="danger" disabled={actionLoading} onClick={() => onUnassign(userId)}>
            Desvincular
          </Button>
        );
      },
    },
  ];

  return (
    <StaffingTable
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="Sin personal asignado. Vincula operadores o usuarios para cubrir los eventos del gestor."
    />
  );
};

export default StaffingTable;
