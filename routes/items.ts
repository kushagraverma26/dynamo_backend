import { dbClient, dbConstants } from '../dbconfig';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Router } from 'express';

let router = Router();
const docClient = DynamoDBDocumentClient.from( dbClient);


// Read all data from order items table
router.get('/', async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: dbConstants.orderItemTableName,
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

// Query to get order items for the given order_id
// Input query parameter: orderId
router.get('/orderItems', async (req, res) => {
    try {
        const orderId = req.query.orderId

        const command = new QueryCommand({
            TableName: dbConstants.orderItemTableName,
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

// Query to get seller data given seller_id
// Input query parameter: seller_id
router.get('/getSeller', async (req, res) => {
    try {
        const sellerId = req.query.sellerId

        const command = new QueryCommand({
            TableName: dbConstants.sellerTableName,
            Limit: dbConstants.queryLimit,
            KeyConditionExpression: "seller_id = :myId",
            ExpressionAttributeValues: {
                ":myId" : sellerId
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

// API to get Item details given the product_id
// Required parameters: product_id
// Includes english name as well. (Replicating a JOIN)
router.get('/productDetails', async (req, res) => {
    try {
        const productId = req.query.productId

        const command = new QueryCommand({
            TableName: dbConstants.productTableName,
            Limit: dbConstants.queryLimit,
            KeyConditionExpression: "product_id = :myId",
            ExpressionAttributeValues: {
                ":myId" : productId
            }
        });
        let initialResponse = await docClient.send(command);
        const initialItems = initialResponse.Items!;
        // If there are product details, then find english name for it and add it to the response
        const updatedItems = await Promise.all(initialItems.map(async (item) => {
            let englishName = "";
            const productCategoryName = item.product_category_name;
            // Do a query to get the english name
            const internalCommand = new QueryCommand({
                TableName: dbConstants.productCategoryTableName,
                Limit: dbConstants.queryLimit,
                KeyConditionExpression: "product_category_name = :categoryName",
                ExpressionAttributeValues: {
                    ":categoryName": productCategoryName
                }
            });
            const response = await docClient.send(internalCommand);
            const responseItem = response.Items?.[0];
            englishName = responseItem?.product_category_name_english || englishName;
            item.product_category_name_english = englishName
            return item;
            }));
        initialResponse.Items = updatedItems;
        res.send(initialResponse);
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: false,
            message: "Internal server error"
        });
    }
})


export default router