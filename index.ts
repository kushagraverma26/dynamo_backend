import express, { Express, Request, Response } from "express";
import bodyParser from 'body-parser';

import orderRoutes from './routes/orders';
import reviewRoutes from './routes/reviews';
import paymentRoutes from './routes/payments';
import customerRoutes from './routes/customers';

const port = 8000;

const app: Express = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/orders', orderRoutes);
app.use('/reviews', reviewRoutes);
app.use('/payments', paymentRoutes);
app.use('/customers', customerRoutes);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World. Welcome to our CSC 244 Backend.");
});

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
}); 