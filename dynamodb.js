const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB({
  region: "us-east-1",
  accessKeyId: process.env.aws_access_key_id,
  secretAccessKey: process.env.aws_secret_access_key,
  sessionToken: process.env.aws_session_token,
});

module.exports = {
  createTable: async (params) => {
    try {
      const data = await dynamodb.createTable(params).promise();
      console.log(`Table created successfully: ${JSON.stringify(data)}`);
      return data;
    } catch (err) {
      console.log(`Error creating table: ${err}`);
      throw err;
    }
  },
  putItem: async (params) => {
    try {
      const data = await dynamodb.putItem(params).promise();
      console.log(`Item added successfully: ${JSON.stringify(data)}`);
      return params.Item; // Return the Item object
    } catch (err) {
      console.log(`Error adding item to table: ${err}`);
      throw err;
    }
  },
  scanTable: async (params) => {
    try {
      const data = await dynamodb.scan(params).promise();
      console.log(`Items found: ${JSON.stringify(data.Items)}`);
      return data.Items;
    } catch (err) {
      console.log(`Error scanning table: ${err}`);
      throw err;
    }
  },
  updateItem: async (params) => {
    try {
      const data = await dynamodb.putItem(params).promise();
      console.log(`Item updated successfully: ${JSON.stringify(data)}`);
      return data.Attributes; // Return the updated Attributes object
    } catch (err) {
      console.log(`Error updating item in table: ${err}`);
      throw err;
    }
  }

};
