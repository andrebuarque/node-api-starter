import HttpStatus from 'http-status';

const sendBadRequest = (res, error) =>
  res.status(HttpStatus.BAD_REQUEST).json({ error });

const sendInternalError = (res, error) =>
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error });

export { sendBadRequest, sendInternalError };
