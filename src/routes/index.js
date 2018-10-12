import usersRoute from './UsersRoute';

export default app => {
  app.get('/', (req, res) => {
    res.send('Node API is running!');
  });

  app.use(usersRoute);
};
