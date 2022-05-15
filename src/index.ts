import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginInlineTraceDisabled,
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import config from './config';
import { dataSource } from './config/database';
import authChecker, { extractTokenFromRequest, verifyToken } from './graphql/auth';
import { Context } from './graphql/context';

const setupServer = async () => {
  const app = express();

  await dataSource.initialize();

  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        path.resolve(__dirname, `graphql/resolvers/*.${process.env.NODE_ENV !== 'production' ? 'ts' : 'js'}`),
      ],
      authChecker,
    }),
    context: ({ req }): Context => {
      try {
        const token = extractTokenFromRequest(req);
        if (token) {
          const appUser = verifyToken(token);
          return {
            token,
            appUser,
          };
        }
      } catch (error) {
        console.error(error);
      }
      return {};
    },

    debug: process.env.NODE_DEV !== 'production',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginInlineTraceDisabled(),
    ],
  });

  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_DEV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: process.env.NODE_DEV === 'production' ? undefined : false,
    }),
  );
  // app.options('*', cors(config.cors));
  app.use(cors(config.cors));

  app.use(compression());

  await server.start();
  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: config.cors,
  });

  httpServer.listen({ port: config.app.port }, () => {
    console.log(`🚀  Server ready at ${config.app.port}`);
  });
};

setupServer();
