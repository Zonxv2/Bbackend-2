import express from 'express';

import authRouter from "../routes/auth.router.js"
import homeRouter from "../routes/home.router.js";
import studentRouter from "../routes/student.router.js";
import apiV1Router from "../routes/api.v1.router.js";
import advancedRouter from "../routes/advancedRouter.js";

import environment, { validateEnv } from '../../config/env.config.js';

import logger from "../middleware/logger.middleware.js";
import { connectAuto } from "../../config/db/connect.config.js";

import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";

import passport from "passport";
import { initPassport } from "../../config/auth/passport.config.js";

const app = express();


const PORT = environment.PORT || 5000;

app.use(express.json());
app.use(logger);
app.use(cookieParser('clave secreta'));

export const startServer = async () => {

  // Validar la existencia de variables de entorno
  validateEnv();


  await connectAuto()

  const store = MongoStore. create({
    client: (await import("mongoose") ) .default. connection. getClient (),
    tt1: 60 * 60,
  })
  app.use(
    session({
      secret: environment.SESSION_SECRET || "clave_secreta",
      resave: false,
      saveUninitialized: false,
      store,
      cookie: {
        maxAge: 1 * 60 * 60 * 1000, // 1 hora
        httpOnly: true
      },
    })
  );

  initPassport();
  app.use(passport.initialize());
  app.use(passport.session());
  
  app.use("/auth", authRouter);
  app.use("/", homeRouter);
  app.use("/student", studentRouter);


  //Agrupar routers
  app.use('/api/v1', apiV1Router);
  app.use('/advanced', advancedRouter);

  app.use((req, res) => {
    req.status(404).json({error: 'Página no encontrada.!'});
  })


  //Manejo de señales de errores globales
  process. on ( 'unhandledRejection', (reason) => {
      console. error ( '[process] Unhandled Rejection', reason);
  });

  process.on('uncaughtException', (err) => {
    console. error('[process] Uncaught Exception ', err);
  });

  process. on('SIGINT', () => {
    console. log('\n[process] SIGINT recibido. Cerrando ...')
  });


  app.listen(PORT, () =>
    console.log(`✅ Servidor escuchando en http://localhost:${PORT}`));
};
