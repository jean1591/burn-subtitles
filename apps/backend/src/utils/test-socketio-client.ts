import { io } from 'socket.io-client';

// Adjust the URL and port if your backend runs elsewhere
const socket = io('ws://localhost:3000/status');

socket.on('connect', () => {
  console.log('Connected to /status namespace');
});

socket.on('jobDone', (data: any) => {
  console.log('jobDone event:', data);
});

socket.on('batchComplete', (data: any) => {
  console.log('batchComplete event:', data);
});

socket.on('zipReady', (data: any) => {
  console.log('zipReady event:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected');
});
