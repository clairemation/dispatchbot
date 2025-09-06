const {getDriverAndRiderNameAndPhoneNumber} = require("./pipelines");

async function getRiderAndDriverData(rideRequestCollection, rideRequestDocumentId)
{
    const result = await rideRequestCollection.aggregate(getDriverAndRiderNameAndPhoneNumber(rideRequestDocumentId)).toArray();
    return {
        riderInfo: result[0].rider[0],
        driverInfo: result[0].driver[0]
    };
}

module.exports = getRiderAndDriverData;