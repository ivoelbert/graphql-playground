import { buildSchema, GraphQLSchema } from 'graphql';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

const delayValue = <T>(time: number, value: T): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), time);
    });
};

// Construct a schema, using GraphQL schema language
export const buildServer = async (): Promise<void> => {
    var schema: GraphQLSchema = buildSchema(`
        type Query {
            hello: String
            echoMessage(msg: String!): String
        }
    `);

    // The root provides a resolver function for each API endpoint
    const hello = () => delayValue(2000, 'Hello world!');
    const echoMessage = ({ msg }: { msg: string }) => delayValue(2000, msg);

    const root = {
        hello,
        echoMessage,
    };

    const app = express();

    app.use(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            rootValue: root,
            graphiql: true,
        })
    );

    app.listen(4000);
    console.log('Running a GraphQL API server at http://localhost:4000/graphql');
};
