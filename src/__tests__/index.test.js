// const AWS = require('aws-sdk');
// const mysql = require('mysql');
// const fs = require('fs').promises;

// const { getAWSSecrets, openDBConnection, closeDBConnection, dbConfig } = require('../main/GeneralUtils');

// jest.mock('fs', () => ({
//   promises: {
//     readFile: jest.fn()
//   }
// }));

// jest.mock('aws-sdk', () => ({
//   config: {
//     update: jest.fn()
//   },
//   SecretsManager: jest.fn(() => ({
//     getSecretValue: jest.fn().mockReturnValueOnce({
//       promise: jest.fn().mockResolvedValueOnce({
//         SecretString: JSON.stringify({
//           host: 'example-host',
//           username: 'example-username',
//           password: 'example-password',
//           dbName: 'example-db',
//           port: 1234
//         })
//       })
//     })
//   }))
// }));

// jest.mock('mysql', () => ({
//   createConnection: jest.fn(() => ({
//     connect: jest.fn(),
//     end: jest.fn()
//   }))
// }));

// describe('Your Test Suite Description', () => {
//   test('should test dbConfig function', async () => {
//     const mockReadFile = fs.promises.readFile;
//     mockReadFile.mockResolvedValueOnce('{"secretName": "example-secret-name", "accessKeyId": "example-access-key-id", "secretAccessKey": "example-secret-access-key", "region": "example-region"}');

//     const connection = await dbConfig();

//     expect(AWS.config.update).toHaveBeenCalledWith({
//       accessKeyId: 'example-access-key-id',
//       secretAccessKey: 'example-secret-access-key',
//       region: 'example-region'
//     });

//     expect(AWS.SecretsManager).toHaveBeenCalled();
//     expect(connection.connect).toHaveBeenCalled();
//     expect(connection.end).not.toHaveBeenCalled();
//   });
// });
