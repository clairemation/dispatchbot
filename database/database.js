const pipelineGenerators = require("./pipelines");

async function updateFields(collection, documentKey, replacementFields){
    const replacementDoc = {$set: replacementFields};
    const filter = {_id: documentKey};
    return await collection.updateOne(filter, replacementDoc);
}

async function getAssociatedRiderAndDriverData(rideRequestCollection, rideRequestKey)
{
    const getAssociatedDriverAndRiderNameAndPhoneNumberPipeline =
        pipelineGenerators.getAssociatedDriverAndRiderNameAndPhoneNumber(rideRequestKey);

    const result = await rideRequestCollection.aggregate(
        getAssociatedDriverAndRiderNameAndPhoneNumberPipeline
    ).toArray();

    return {
        riderData: result[0].rider[0],
        driverData: result[0].driver[0]
    };
}

module.exports = {updateFields, getAssociatedRiderAndDriverData};