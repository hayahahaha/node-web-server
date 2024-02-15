import * as net from 'net';

type TCPConn = {
  socket: net.Socket,
  reader: null | {
    resolve: (value: Buffer) => void,
    reject: (reson: Error) => void,
  },
  err: null | Error,
  ended: boolean,
}

export default TCPConn;
