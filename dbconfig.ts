import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import 'dotenv/config';

const dbClient = new DynamoDBClient({ region: "us-west-1", credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
}});

const dbConstants = {
    customerTableName: "customers244",
    orderTableName: "orders244",
    paymentTableName: "orderpayments244",
    orderItemTableName: "orderitems244",
    productTableName: "products244",
    productCategoryTableName: "productcategory244",
    reviewTableName: "reviews244",
    sellerTableName: "sellers244",
    locationTableName: "geolocation44",
    queryLimit: 10
}

export { dbClient, dbConstants };
