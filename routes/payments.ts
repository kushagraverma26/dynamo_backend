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
        res.send(error);
    }
})

export default router