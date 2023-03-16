
import { ApolloServer } from '@apollo/server';
import { readFile } from 'fs/promises';
import resolvers from './resolver.js';
import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { Events, Users } from './db.js';

const app = express();
app.use(cors(), express.json());

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne((user) => user.email === email);
    if (user && user.token === password + "_token") {
        const token = user.password + "_token";
        res.json({ token });
    } else {
        res.sendStatus(401);
    }
});

// app.get('/shows', async (req, res) => {
//     res.status(200).json(await Events.findAll());
// });

const context = async ({ req }) => {
    if (req.headers.auth) {
        const user = await Users.findOne((user) => user.token === req.headers.auth);
        return { user };
    }
    return {};
};

const typeDefs = await readFile("./schema.graphql", 'utf-8');
const apolloServer = new ApolloServer({ typeDefs, resolvers });
await apolloServer.start();


app.use("/graphql", expressMiddleware(apolloServer, { context }));

const PORT = 4000;

app.listen("4000", () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
})

