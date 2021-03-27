import * as AWS from 'aws-sdk';
import * as crypto from 'crypto';

const docClient = new AWS.DynamoDB.DocumentClient();
const eventBridge = new AWS.EventBridge();

export const addLolly = async (lolly: Lolly) => {
    const idPair = {
        id: crypto.randomBytes(32).toString("hex")
    }
    const lollyToAdd = {...lolly, ...idPair}

    const params = {
        TableName: process.env.TABLE_NAME! || "VirtualLolly",
        Item: lollyToAdd
    }

    await docClient.put(params).promise();
    const e = await eventBridge.putEvents({
        Entries: [
            {
                EventBusName: "default",
                Source: "rebuildCodePipeline",
                DetailType: "rebuildSite",
                Detail: `{"action": "codeBuild"}`
            }
        ]
    }).promise();
    console.log(JSON.stringify(e));
    return lollyToAdd
}