import express, { Express, Request, Response } from "express";

import orderRoutes from './routes/orders';

const port = 8000;

const app: Express = express();

app.use('/orders', orderRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World. Welcome to our CSC 244 Backend.");
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
}); 