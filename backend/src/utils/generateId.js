const generateTicketId = async (TicketModel) => {
  const date  = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = (await TicketModel.countDocuments()) + 1;
  return `TKT-${date}-${String(count).padStart(4, '0')}`;
};

const generateIncidentId = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `INC-${date}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};

const generateSubTaskId = (parentTicketId, suffix) =>
  `${parentTicketId}-${suffix}`;

module.exports = { generateTicketId, generateIncidentId, generateSubTaskId };
