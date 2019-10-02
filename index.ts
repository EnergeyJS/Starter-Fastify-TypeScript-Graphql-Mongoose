import * as fastify from "fastify";
import * as cors from 'cors'
import { Server, IncomingMessage, ServerResponse } from "http";
import { ApolloServer } from "apollo-server-fastify";
import typeDefs from "./src/types";
import resolvers from "./src/resolvers";
import "./src/lib/Config";
import ConnectDB from "./src/lib/ConnectDB";

const { DB_URL } = process.env;

const app: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
    logger: {
      prettyPrint: { translateTime: 'yyyy-mm-dd HH:MM:ss' },
    }
  });


const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

const start = async () => {
  ConnectDB(async (dbURL) => {
    app.log.info(`Mongoose Connected at ${dbURL}`)
    try {
      app.register(server.createHandler());
      await app.listen(3000, "0.0.0.0");

    } catch (err) {
      app.log.error(err)
      process.exit(1);
    }
  });
};

process.on("uncaughtException", error => {
  console.error(error);
});
process.on("unhandledRejection", error => {
  console.error(error);
});

start();



