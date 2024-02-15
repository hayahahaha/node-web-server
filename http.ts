type HTTPReq = {
  method: string,
  uri: Buffer,
  version: string,
  headers: Buffer[],
}

type HTTPRes = {
  code: number,
  headers: Buffer[],
  body: BodyReader,
}

type BodyReader = {
  // the "Content-Length", -1 if unknown.
  length: number,
  // read data. returns an empty buffer after EOF.
  read: () => Promise<Buffer>,
};

export {
  HTTPReq,
  HTTPRes,
  BodyReader,
}
