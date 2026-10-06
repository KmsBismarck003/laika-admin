const getUserId = (entry = {}) => entry.userId ?? entry.user_id ?? entry.id;

const getContractRef = (entry = {}) => entry.contractId ?? entry.contract_id ?? null;

export const buildAssignmentIndex = (assignments = []) => {
  const byUser = new Map();
  assignments.forEach((entry) => {
    const userId = getUserId(entry);
    if (userId === undefined || userId === null) return;
    const key = String(userId);
    if (!byUser.has(key)) byUser.set(key, []);
    byUser.get(key).push(entry);
  });
  return byUser;
};

export const isExclusiveViolation = (userId, currentContractId, activeAssignments = []) => {
  if (userId === undefined || userId === null) return false;
  const targetUser = String(userId);
  const current = currentContractId === undefined || currentContractId === null ? null : String(currentContractId);
  return activeAssignments.some((entry) => {
    const ref = getContractRef(entry);
    if (ref !== null && current !== null && String(ref) === current) return false;
    const candidate = getUserId(entry);
    if (candidate === undefined || candidate === null) return false;
    return String(candidate) === targetUser;
  });
};

export const filterAvailable = (users = [], assignedIds = [], query = '') => {
  const assigned = new Set((assignedIds || []).map((id) => String(id)));
  const normalizedQuery = String(query || '').trim().toLowerCase();
  return users.filter((user) => {
    if (assigned.has(String(user.id))) return false;
    if (!normalizedQuery) return true;
    const fullName = `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.toLowerCase();
    const email = String(user.email || '').toLowerCase();
    return fullName.includes(normalizedQuery) || email.includes(normalizedQuery);
  });
};

export const getDisplayName = (user = {}) => {
  const full = `${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim();
  return full || user.email || `ID ${user.id ?? ''}`;
};

export default { buildAssignmentIndex, isExclusiveViolation, filterAvailable, getDisplayName };
