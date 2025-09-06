require('dotenv').config();
const {getDatabaseConnectionAsync} = require("./setup");
const getRiderAndDriverData = require("./database");
const dbUri = process.env.MONGODB_URI;

function createChangeListener()
{
    let subscribers = [];

    function addSubscriber(subscriber)
    {
        subscribers.push(subscriber);
    }

    async function start() {
        const databaseConnection = await getDatabaseConnectionAsync(dbUri);

        const [rideRequestCollection, userCollection, providerCollection, vehicleCollection] = await Promise.all([
                databaseConnection.getCollectionAsync("ride-requests"),
                databaseConnection.getCollectionAsync("users"),
                databaseConnection.getCollectionAsync("service-providers"),
                databaseConnection.getCollectionAsync("vehicles")
            ]
        );

        const changeStream = rideRequestCollection.watch();

        changeStream.on('change', consumeChange);

        async function consumeChange(change) {
            if (change.operationType === "update") {
                const update = change.updateDescription.updatedFields;
                const {riderInfo, driverInfo} = await getRiderAndDriverData(rideRequestCollection, change.documentKey._id);
                for (let subscriber of subscribers) {
                    subscriber({update, riderInfo, driverInfo});
                }
            }
        }
    }

    return {start, addSubscriber};
}

module.exports = createChangeListener;