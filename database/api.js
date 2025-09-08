require('dotenv').config();
const {getDatabaseConnectionAsync} = require("./setup");
const {getAssociatedRiderAndDriverData, updateFields} = require("./database");

const dbUri = process.env.MONGODB_URI;

function createDatabaseApi()
{
    let onChangeSubscribers = [];
    let rideRequestCollection, userCollection, providerCollection, vehicleCollection;

    function onRideRequestChange(subscriber)
    {
        onChangeSubscribers.push(subscriber);
    }

    async function update(documentKey, fields)
    {
        if (!rideRequestCollection)
        {
            throw new Error("No connection to database. Make sure connect() has been run before calling update().");
        }
        return await updateFields(rideRequestCollection, documentKey, fields);
    }

    async function fetchAssociatedRiderAndDriverDataFromRideRequest(rideRequestKey)
    {
        return await getAssociatedRiderAndDriverData(rideRequestCollection, rideRequestKey);
    }

    async function connect()
    {
        const databaseConnection = await getDatabaseConnectionAsync(dbUri);

        [rideRequestCollection, userCollection, providerCollection, vehicleCollection] = await Promise.all([
                databaseConnection.getCollectionAsync("ride-requests"),
                databaseConnection.getCollectionAsync("users"),
                databaseConnection.getCollectionAsync("service-providers"),
                databaseConnection.getCollectionAsync("vehicles")
            ]
        );

        const rideRequestChangeStream = rideRequestCollection.watch();

        rideRequestChangeStream.on('change', async change =>
        {
            if (change.operationType === "update") {
                const rideRequestKey = change.documentKey._id;
                const changedFields = change.updateDescription.updatedFields;
                for (let subscriber of onChangeSubscribers) {
                    subscriber({rideRequestKey, changedFields});
                }
            }
        });
    }

    return {connect, update, onRideRequestChange, fetchAssociatedRiderAndDriverDataFromRideRequest: fetchAssociatedRiderAndDriverDataFromRideRequest};
}

module.exports = createDatabaseApi;