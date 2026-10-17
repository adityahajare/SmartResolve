import { useEffect } from 'react';
import { initSocket, disconnectSocket } from '../socket/socket';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { useTicketStore } from '../store/ticketStore';

export const useSocket = () => {
  const token = useAuthStore(state => state.token);
  const addNotification = useNotificationStore(state => state.addNotification);
  const updateTicketStatus = useTicketStore(state => state.updateTicketStatus);
  const addMessageToTicket = useTicketStore(state => state.addMessageToTicket);

  useEffect(() => {
    if (!token) return;
    const socket = initSocket(token);

    socket.on('notification', (data) => {
      addNotification(data);
    });

    socket.on('ticket_updated', (data) => {
      if (data.ticketId && data.status) {
        updateTicketStatus(data.ticketId, data.status);
      }
    });

    socket.on('new_message', (data) => {
      if (data.ticketId && data.message) {
        addMessageToTicket(data.ticketId, data.message);
      }
    });

    return () => {
      // Don't disconnect on every render, manage socket lifecycle safely
    };
  }, [token]);
};
