import * as AWS from 'aws-sdk';
const docClient = new AWS.DynamoDB.DocumentClient();

export const getLollyById = async (id: string) => {
    const params = {
        TableName: process.env.TABLE_NAME! || "VirtualLolly",
        Key: {
            id: id
        }
    }

    const data = await docClient.get(params).promise();
    return data.Item;
}