import { dbClient, dbConstants } from '../dbconfig';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Router } from 'express';

let router = Router();
const docClient = DynamoDBDocumentClient.from( dbClient);

// Partition key: order_id

// Read all payments
router.get('/', async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: dbConstants.paymentTableName,
            FilterExpression: "attribute_exists(payment_type)",
            Limit: dbConstants.queryLimit
        });
        const response = await docClient.send(command);
        res.send(response);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: "Internal server error"
        });
    }
})

// Query payment details when provided with an order_id
// Input query parameter: orderId
router.get('/query', async (req, res) => {
    try {
        const orderId = req.query.orderId

        const command = new QueryCommand({
            TableName: dbConstants.paymentTableName,
            Limit: dbConstants.queryLimit,
            KeyConditionExpression: "order_id = :myId",
            ExpressionAttributeValues: {
                ":myId" : orderId
            }
        });
        const response = await docClient.send(command);
        res.send(response);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: "Internal server error"
        });
    }
})

export default router