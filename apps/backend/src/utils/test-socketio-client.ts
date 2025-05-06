import { EventTypes } from '../constants/events';
import { io } from 'socket.io-client';

// Adjust the URL and port if your backend runs elsewhere
const socket = io('ws://localhost:3000/status');

socket.on(EventTypes.CONNECT, () => {
  console.log('Connected to /status namespace');
});

socket.on(EventTypes.JOB_DONE, (data: any) => {
  console.log('jobDone event:', data);
});

socket.on(EventTypes.BATCH_COMPLETE, (data: any) => {
  console.log('batchComplete event:', data);
});

socket.on(EventTypes.ZIP_READY, (data: any) => {
  console.log('zipReady event:', data);
});

socket.on(EventTypes.DISCONNECT, () => {
  console.log('Disconnected');
});
