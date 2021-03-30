import { io, Socket } from 'socket.io-client';

export interface JottoSocket extends Socket {
  sessionId?: string;
  userId?: string;
  username?: string;
}

type Auth = {
  username?: string;
  sessionId?: string;
}

const URL = 'http://localhost:3001';
let socket: JottoSocket = io(URL, { autoConnect: false });

// log everything
socket.onAny((event, ...args) => {
  console.log(event, args);
});

/**
 * Update the authentication for the socket
 * @param auth Update socket auth properties
 */
export function updateSocketAuth(auth: Auth): void {
  // This isn't working for setting the username for some reason
  // socket = io(URL, {
  //   autoConnect: false,
  //   auth: socketAuth
  // });

  // @ts-ignore
  socket.auth = auth;
}

export default socket;