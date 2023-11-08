import express, { Express, Request, Response } from "express";

import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';
import paymentRoutes from './routes/payments';

const port = 8000;

const app: Express = express();

app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/payments', paymentRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World. Welcome to our CSC 244 Backend.");
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
}); 