import { dbClient, dbConstants } from '../dbconfig';
import { DynamoDBDocumentClient, ScanCommand, QueryCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Router } from 'express';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

let router = Router();
const docClient = DynamoDBDocumentClient.from( dbClient);

// Partition key: order_id

// Read all reviews
router.get('/', async (req, res) => {
    try {
        const command = new ScanCommand({
            TableName: dbConstants.reviewTableName,
            FilterExpression: "attribute_exists(review_comment_message)",
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

// Get one specific reviews for which the orderId is provided
// Input query parameter: orderId, createdDate (optional)
router.get('/query', async (req, res) => {
    try {
        const orderId = req.query.orderId
        const createdDate = req.query.createdDate

        // Make key condition expression and attribute values based on given data
        let conditionExpression = "order_id = :myId";
        let attributeValues: { [key: string]: any } = {
            ":myId" : orderId
        };

        if (createdDate !== undefined) {
            conditionExpression += " AND review_creation_date = :myDate";
            attributeValues[":myDate"] = createdDate;
        }

        const command = new QueryCommand({
            TableName: dbConstants.reviewTableName,
            Limit: dbConstants.queryLimit,
            KeyConditionExpression: conditionExpression,
            ExpressionAttributeValues: attributeValues
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

// Endpoint to add a review
// required parameters:
// orderId:51eaae3287e04efba45a51f52098fc88
// score:5
// title:Second Test Review
// comment:Good Product
router.post('/create', async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const score = req.body.score;
        const title = req.body.title;
        const comment = req.body.comment;
        const creationDate = moment().format('YYYY-MM-DD HH:mm:ss');
        const command = new PutCommand({
            TableName: dbConstants.reviewTableName,
            Item: {
                review_id: uuid(),
                order_id: orderId,
                review_score: score,
                review_comment_title: title,
                review_comment_message: comment,
                review_creation_date: creationDate,
                review_answer_timestamp: ''
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


// Endpoint to edit a review
// required parameters:
// orderId:51eaae3287e04efba45a51f52098fc88
// creationDate
// updatedScore: 5 (send old one if unchanged)
// updatedTitle:Second Test Review (send old one if unchanged)
// updatedComment:Good Product (send old one if unchanged)
router.post('/edit', async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const updatedScore = req.body.updatedScore;
        const updatedTitle = req.body.updatedTitle;
        const updatedComment = req.body.updatedComment;
        const creationDate =req.body.creationDate
        const command = new UpdateCommand({
            TableName: dbConstants.reviewTableName,
            Key: {
                order_id: orderId,
                review_creation_date: creationDate
              },
              UpdateExpression: "set review_score = :newScore, review_comment_title = :newTitle, review_comment_message = :newComment",
              ExpressionAttributeValues: {
                ":newScore": updatedScore,
                ":newTitle": updatedTitle,
                ":newComment": updatedComment
              },
              ReturnValues: "ALL_NEW",
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

// Endpoint to delete a review
// Required parameters:
// orderId and creationDate
router.post('/delete', async (req, res) => {
    try {
        const orderId = req.body.orderId;
        const creationDate = req.body.creationDate
        const command = new DeleteCommand({
            TableName: dbConstants.reviewTableName,
            Key: {
                order_id: orderId,
                review_creation_date: creationDate
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