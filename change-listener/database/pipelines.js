const pipelineGenerators= {
    getAssociatedDriverAndRiderNameAndPhoneNumber: rideRequestDocumentId => [
        // Get ride request document by document id
        {
            '$match' : {
                '_id' : rideRequestDocumentId
            }
        },
        // Fetch name and phone number of associated rider(s)
        {
            '$lookup': {
                'from': 'users',
                'localField': 'serviceUserUuid',
                'foreignField': 'uuid',
                'pipeline': [{'$project': {'fullName': 1, 'phone': 1}}],
                'as': 'rider',
            }
        },
        // Fetch name and phone number of associated driver(s)
        {
            '$lookup': {
                'from': 'service-providers',
                'localField': 'driverUuid',
                'foreignField': 'uuid',
                'pipeline': [{'$project': {'fullName': 1, 'mobilePhone': 1}}],
                'as': 'driver'
            }
        },
        // Trim results to only the rider and driver info
        {
            '$project': {
                'rider': 1,
                'driver': 1
            }
        }
    ]
}

module.exports = pipelineGenerators;