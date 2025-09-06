require('dotenv').config();
const {getDatabaseConnectionAsync} = require("./database/setup");
const {getAssociatedRiderAndDriverData} = require("./database/database");

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

        const rideRequestChangeStream = rideRequestCollection.watch();

        rideRequestChangeStream.on('change', consumeChange);

        async function consumeChange(change) {
            if (change.operationType === "update") {
                const changedDocumentKey = change.documentKey._id;
                const changedFields = change.updateDescription.updatedFields;
                const {riderData, driverData} = await getAssociatedRiderAndDriverData(rideRequestCollection, changedDocumentKey);
                for (let subscriber of subscribers) {
                    subscriber({changedFields, riderData, driverData});
                }
            }
        }
    }

    return {start, addSubscriber};
}

module.exports = createChangeListener;