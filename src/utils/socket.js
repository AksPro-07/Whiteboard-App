import { io } from 'socket.io-client';

let socket;
const API_BASE_URI = process.env.REACT_APP_API_BASE_URL;
const token = localStorage.getItem('whiteboard_user_token');

export const connectSocket = (token) => {
  socket = io(`${API_BASE_URI}`, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return socket;
};

export const getSocket = () => socket;
