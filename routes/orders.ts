import { dbClient } from '../dbconfig';
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Router } from 'express';

let router = Router();
const docClient = DynamoDBDocumentClient.from( dbClient);


const orderTableName = 'TestOrders';

// Read all orders
router.get('/', async (req, res) => {
    try {

        const command = new ScanCommand({
            TableName: orderTableName,
        });
        const response = await docClient.send(command);
        for (const order of response.Items!) {
        console.log(order);
        }
        res.send(response);
    } catch (error) {
        console.log(error)
        res.send(error);
    }
})

export default router