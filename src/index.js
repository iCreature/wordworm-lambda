const AWS = require('aws-sdk');
const mysql = require('mysql2/promise');
import { Handler, APIGatewayProxyEvent } from 'aws-lambda';

export const handler = async (event, context) => {
  try {
    const pathParameters = event.pathParameters || {};
    const queryStringParameters = event.queryStringParameters || {};
    const body = JSON.parse(event.body || '{}');

    const tableName = pathParameters.table || queryStringParameters.table;
    const requestData = body;

    const secretName = process.env.SECRET_NAME;
    const region = process.env.REGION;

    const secretsManager = new AWS.SecretsManager({ region });
    const secretValue = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const secret = JSON.parse(secretValue.SecretString);

    const connection = await mysql.createConnection({
      host: secret.host,
      user: secret.username,
      password: secret.password,
      database: secret.dbname
    });

    if (event.httpMethod === 'GET') {
      const [rows, fields] = await connection.execute(`SELECT * FROM ${tableName}`);
      await connection.end();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Database query successful', data: rows }),
      };
    } else if (event.httpMethod === 'POST') {
      const [result] = await connection.execute('INSERT INTO sentences (words) VALUES ?', [requestData]);
      await connection.end();
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Data added successfully', data: result }),
      };
    } else {
      // Handle unsupported HTTP methods
      await connection.end();
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad Request', error: 'Unsupported HTTP method' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error', error: error.message }),
    };
  }
};
