import { io } from 'socket.io-client';

const urls = {
    server1: "http://localhost:3000",
    server2: process.env.REACT_APP_BACKEND_URL
};

// Create multiple socket instances
const sockets = {
    server1: io(urls.server1),
    server2: io(urls.server2),
};

export default sockets;