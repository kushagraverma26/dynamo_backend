import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';

const dbClient = new DynamoDBClient({ region: "us-west-1", credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
}});

export { dbClient };
