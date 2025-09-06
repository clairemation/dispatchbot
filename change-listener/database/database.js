const pipelineGenerators = require("./pipelines");

async function getAssociatedRiderAndDriverData(rideRequestCollection, rideRequestDocumentId)
{
    const getAssociatedDriverAndRiderNameAndPhoneNumberPipeline =
        pipelineGenerators.getAssociatedDriverAndRiderNameAndPhoneNumber(rideRequestDocumentId);

    const result = await rideRequestCollection.aggregate(
        getAssociatedDriverAndRiderNameAndPhoneNumberPipeline
    ).toArray();

    return {
        riderData: result[0].rider[0],
        driverData: result[0].driver[0]
    };
}

module.exports = {getAssociatedRiderAndDriverData};