const AWS = require('aws-sdk');
const mysql = require('mysql');
const fs = require('fs').promises

const awsSecrets = 'secrets/secrets.json';

// getAWS secrets
async function getAWSSecrets(filePath) {
    try {

        const secrets = JSON.parse(await fs.readFile(filePath,'utf-8'));

        if (secrets.secretName != null) {
            throw new Error('Secret not found');
        }

        AWS.config.update({
            accessKeyId: secrets.accessKeyId,
            secretAccessKey : secrets.secretAccessKey,
            region:secrets.region
        });

        const secretsManager = new AWS.SecretsManager();
        const secretName = secrets.secretName;
    
        const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        return JSON.parse(data.SecretString);

    } catch(error) {
        throw new Error(`Error fetching AWS secrets: ${error.message}`);
    }
}

// open db connection
function openDBConnection(dbConfig) {
    const connection = mysql.createConnection(dbConfig);
  
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL database:', err.message);
        throw err;
      }
      console.log('Connected to MySQL database!');
    });
  
    return connection;
  }

  // close db connection
  function closeDBConnection(connection) {
    connection.end((err) => {
      if (err) {
        console.error('Error closing MySQL database connection:', err.message);
      } else {
        console.log('Closed MySQL database connection!');
      }
    });
  }

  // database configurations
  async function dbConfig(secrets) {
    try {
      const awsSecrets = await getAWSSecretsFromFile(awsSecrets);
      const dbConfig = {
        host: awsSecrets.dbHost,
        user: awsSecrets.dbUser,
        password: awsSecrets.dbPassword,
        database: awsSecrets.dbName
      };
  
     const dbConnection = openDBConnection(dbConfig);
     return dbConnection;
      // Don't forget to close the connection when done
     // closeDBConnection(dbConnection);
    } catch (error) {
      console.error(error.message);
    }
  }

