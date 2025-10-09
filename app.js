import express from "express";
import homeRouter from './routes/home.router.js';
import studentRouter from './routes/student.router.js';
import userRouter from './routes/user.router.js';

import { connectToMongoDB } from "./config/db/connect.config.js";

import logger from "./middleware/logger.middleware.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(logger);

app.use('/', homeRouter);
app.use('/student', studentRouter);
app.use('/auth', userRouter);

const startServer = async () => {
    await connectToMongoDB();
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));

}

await startServer();