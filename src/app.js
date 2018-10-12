import 'babel-polyfill';
import express from 'express';
import routes from './routes';
import database from './config/database';
import auth from './config/auth';

const app = express();
app.use(express.json());
app.use(auth.initialize());

database.connect();
routes(app);

export default app;
