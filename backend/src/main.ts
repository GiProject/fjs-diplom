import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import {logger} from "./middleware/logger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: false});
  app.use(logger);
  app.use(
      session({
        secret: 'secret',
      resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 3600000 },
      }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
