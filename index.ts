import * as net from 'net';
import TCPConn from './type';
import { soInit, soRead, soWrite } from './socket';
import DynBuf, { bufPush, bufPop } from './DynBuf';
import { HTTPRes, HTTPReq, BodyReader } from './http';

const server = net.createServer({
  allowHalfOpen: true,
  pauseOnConnect: true,
});

async function newConn(socket: net.Socket): Promise<void> {
  console.log('new connection : ', socket.removeListener, socket.remotePort);
  try {
    await serverClient(socket);
  } catch (error) {
    console.error('expection: ', error);
  } finally {
    socket.destroy();
  }
}

async function serverClient(socket: net.Socket) {
  const conn: TCPConn = soInit(socket);
  const buf: DynBuf = { data: Buffer.alloc(0), length: 0 };

  while (true) {
    const msg = cutMessage(buf);
    if (!msg) {
      // omitted ..
      continue;
    }

    // process the message and send the response
    if (msg.equals(Buffer.from('quit\n'))) {
      await soWrite(conn, Buffer.from('Bye.\n'));
      socket.destroy();
      return;
    } else {
      const reply = Buffer.concat([Buffer.from('Echo: '), msg]);
      await soWrite(conn, reply);
    }
  }
}

function cutMessage(buf: DynBuf): Buffer | null {
  // messages are separated by '\n'
  const idx = buf.data.subarray(0, buf.length).indexOf('\n');
  if (idx < 0) {
    return null;    // not complete
  }
  // make a copy of the message and move the remaining data to the front
  const msg = Buffer.from(buf.data.subarray(0, idx + 1));
  bufPop(buf, idx + 1);
  return msg;
}

function onError(err: Error) {
  throw err;
}

server.on('connection', newConn);
server.on('error', onError);

server.listen({
  host: '127.0.0.1',
  port: 3000,
}, () => {
  console.log('server start');
})

