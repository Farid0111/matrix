import { Client, Account, Databases, ID, Query } from 'appwrite';

export const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('matrix');

export const account = new Account(client);
export const databases = new Databases(client, 'main_db');
export { ID, Query } from 'appwrite';
export const getTicketTypes = async () => {
  return databases.listDocuments('main_db', 'ticket_type').then(
    async function (response) {
      return response;
    },
    function (error) {
      return undefined;
    }
  );
};

export const findTicket = async (nonce) => {
  return databases
    .listDocuments('main_db', 'tickets', [Query.equal('nonce_value', nonce)])
    .then(
      async function (response) {
        return response;
      },
      function (error) {
        console.log('error is', error);
        return undefined;
      }
    );
};

export const getNonces = async () => {
  return databases.listDocuments('main_db', 'nonce').then(
    async function (response) {
      return response;
    },
    function (error) {
      return undefined;
    }
  );
};

export const saveNonce = async (data) => {
  return databases.createDocument('main_db', 'nonce', ID.unique(), data).then(
    async function (response) {
      return response;
    },
    function (error) {
      return undefined;
    }
  );
};
