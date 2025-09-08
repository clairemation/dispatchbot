require('dotenv').config({ path: '../.env' });
const { MongoClient } = require('mongodb');

async function getDatabaseConnectionAsync(dbUri)
{
    const client = await new MongoClient(dbUri).connect();

    async function getCollectionAsync(collectionName) {
        const db = client.db();
        const collection = db.collection(collectionName);
        return collection;
    }

    return {getCollectionAsync};
}

module.exports = {getDatabaseConnectionAsync}