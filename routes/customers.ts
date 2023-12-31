import { dbClient, dbConstants } from '../dbconfig';
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { Router } from 'express';

let router = Router();
const docClient = DynamoDBDocumentClient.from( dbClient);

// Partition key: customer_id

// Read all customers
router.get('/', async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: dbConstants.customerTableName,
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

export default router