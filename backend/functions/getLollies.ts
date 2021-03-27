import * as AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();

export const getLollies = async () => {
    const params = {
        TableName: process.env.TABLE_NAME! || "VirtualLolly"
    }

    const data = await docClient.scan(params).promise();
    return data.Items;
}