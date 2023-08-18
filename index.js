import express from 'express';
import cors from 'cors';
import condb from './databases/connect.js';
import dotenv from 'dotenv';

import movieRouter from './routes/movieRouter.js';
import userRouter from './routes/userRouter.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1/movies', movieRouter);
app.use('/api/v1/users', userRouter);

const startServer = async () => {
  try {
    condb(process.env.MONGODB_URL);

    app.listen(port, () => console.log(`Server started on port http://localhost:${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
