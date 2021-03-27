// const requireEsm = require('esm')(module);
// module.exports = requireEsm('./gatsby-node.esm.js');

const path = require("path");
require("dotenv").config();
const AWS = require("aws-sdk")

exports.createPages = async function ({ actions, graphql }) {
  try {
      const docClient = new AWS.DynamoDB.DocumentClient({
        region: "us-east-2"
      });

      const params = {
        TableName: "VirtualLolly"
      }
      const data = await docClient.scan(params).promise()
      console.log(data.Items);

      // const data = await graphql(`
      //   query MyQuery {
      //     Lollies {
      //       getLollies {
      //         id
      //         lollyBottom
      //         lollyMiddle
      //         lollyTop
      //         message
      //         reciever
      //         sender
      //       }
      //     }
      //   }
      // `)
      // const lollies  = data.data.Lollies.getLollies
      data!== null && data.Items.forEach((lolly) => {
        console.log(lolly);
        actions.createPage({
          path: `lolly/${lolly.id}`,
          component: require.resolve(`./src/components/LollyTemplate.tsx`),
          context: {
            // Data passed to context is available
            // in pageContext props of the template component
            id: lolly.id,
            sender: lolly.sender,
            reciever: lolly.reciever,
            message: lolly.message,
            lollyTop: lolly.lollyTop,
            lollyMiddle: lolly.lollyMiddle,
            lollyBottom: lolly.lollyBottom,
          },
        });
      });
  } catch (error) {
    console.log(error);
  }
};
