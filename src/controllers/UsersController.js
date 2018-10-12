import HttpStatus from 'http-status';
import User from '../models/User';
import to from 'await-to-js';
import properties from '../config/properties';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendBadRequest, sendInternalError } from '../helpers/HttpHelper';

export default {
  async index(req, res) {
    try {
      const [err, users] = await to(User.find({}));
      if (err) return sendBadRequest(res, err.message);

      res.json(users);
    } catch (err) {
      sendInternalError(res, err);
    }
  },

  async create(req, res) {
    try {
      const [err, user] = await to(User.create(req.body));
      if (err) return sendBadRequest(res, err.message);

      const token = jwt.sign({ id: user._id }, properties.jwtSecret);

      res.status(HttpStatus.CREATED).json({ user, token });
    } catch (err) {
      return sendInternalError(res, err);
    }
  },

  async authenticate(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) return res.sendStatus(HttpStatus.BAD_REQUEST);

      const [err, user] = await to(User.findOne({ email }).select('+password'));
      if (err || !user) return res.sendStatus(HttpStatus.UNAUTHORIZED);

      if (bcrypt.compareSync(password, user.password)) {
        return res.json({
          name: user.name,
          email: user.email,
          token: jwt.sign({ id: user._id }, properties.jwtSecret)
        });
      }

      res.sendStatus(HttpStatus.UNAUTHORIZED);
    } catch (err) {
      return sendInternalError(res, err);
    }
  }
};
