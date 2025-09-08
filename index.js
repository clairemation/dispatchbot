const createDatabaseApi = require("./database/api");

const database = createDatabaseApi();

const driverPhoneToRideRequestKey = {};
const riderPhoneToRideRequestKey = {};

database.onRideRequestChange(consumeChange);
database.connect();

async function consumeChange(change)
{
    const {rideRequestKey, changedFields} = change;
    if (changedFields.rideRequestStatus === 400) {
        const {riderData, driverData} = await database.fetchAssociatedRiderAndDriverDataFromRideRequest(rideRequestKey);
        driverPhoneToRideRequestKey[driverData.mobilePhone] = rideRequestKey;
        riderPhoneToRideRequestKey[riderData.phone] = rideRequestKey;
        return await alertDriver(driverData.fullName, driverData.mobilePhone);
    }
}

async function alertDriver(driverName, driverPhone)
{
    // do something
}


async function doSomethingInResponseToSmsMessage(senderPhoneNumber)
{
    const rideRequestKey = driverPhoneToRideRequestKey[senderPhoneNumber];
    const databaseFieldsToUpdate = {rideRequestStatus: 1000};
    return await database.update(rideRequestKey, databaseFieldsToUpdate);
}
