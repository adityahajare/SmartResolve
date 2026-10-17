import { create } from 'zustand';

export const useTicketStore = create((set) => ({
  tickets: [],
  priorityQueue: [],
  activeTicket: null,
  frustrationAlerts: [],

  setTickets: (tickets) => set({ tickets }),
  setPriorityQueue: (priorityQueue) => set({ priorityQueue }),
  setActiveTicket: (ticket) => set({ activeTicket: ticket }),

  updateTicketStatus: (id, status) => set((state) => ({
    tickets: state.tickets.map(t => t._id === id || t.ticketId === id ? { ...t, status } : t),
    activeTicket: state.activeTicket && (state.activeTicket._id === id || state.activeTicket.ticketId === id)
      ? { ...state.activeTicket, status } : state.activeTicket
  })),

  addMessageToTicket: (id, msg) => set((state) => ({
    activeTicket: state.activeTicket && (state.activeTicket._id === id || state.activeTicket.ticketId === id)
      ? { ...state.activeTicket, messages: [...(state.activeTicket.messages || []), msg] }
      : state.activeTicket
  }))
}));
