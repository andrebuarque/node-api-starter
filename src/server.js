import app from './app';

app.listen(process.env.NODE_PORT, () => {
  console.log(`listening on ${process.env.NODE_PORT}`);
});
