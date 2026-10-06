export const MIN_OPERATORS_PER_EVENT = 1;

const countOperators = (assigned = []) => assigned.filter((entry) => {
  const role = String(entry.roleInContract || entry.role || '').toUpperCase();
  return role === 'OPERADOR' || role === 'OPERATOR' || role === 'MANAGER';
}).length;

export const getEventCoverage = (event = {}, assigned = [], minimum = MIN_OPERATORS_PER_EVENT) => {
  const operatorCount = countOperators(assigned);
  const meetsMinimum = operatorCount >= minimum;
  return { hasOperators: operatorCount > 0, operatorCount, meetsMinimum };
};

export const getContractCoverage = (events = [], assigned = [], minimum = MIN_OPERATORS_PER_EVENT) => {
  const detail = events.map((event) => ({
    event,
    ...getEventCoverage(event, assigned, minimum),
  }));
  const covered = detail.filter((item) => item.meetsMinimum).length;
  return {
    total: events.length,
    covered,
    uncovered: events.length - covered,
    allCovered: events.length > 0 && covered === events.length,
    detail,
  };
};

export default { MIN_OPERATORS_PER_EVENT, getEventCoverage, getContractCoverage };
