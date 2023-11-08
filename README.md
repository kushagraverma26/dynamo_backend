# Backend for DynamoDB 

Create a file named ".env" (dot is important) in the root folder of your project (dynamo_backend).
Add the AWS keys to your .env file.

AWS_ACCESS_KEY_ID = "put_key_here"
AWS_SECRET_ACCESS_KEY = "put_key_here"

## Steps to run:

1. 'npm install' to install dependencies
2. 'npm run serve' to run in dev mode

## File dbconfig.ts :

Change queryLimit to higher value (around 1000) to get more data. Since scan in expensive, this value is currently 10 for API testing purposes.

queryLimit = 