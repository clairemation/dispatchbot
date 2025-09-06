const pipelineGenerators= {
    getDriverAndRiderNameAndPhoneNumber: rideRequestDocumentId => [
        // Get ride request document by document id
        {
            '$match' : {
                '_id' : rideRequestDocumentId
            }
        },
        // Aggregate name and phone number of associated rider
        {
            '$lookup': {
                'from': 'users',
                'localField': 'serviceUserUuid',
                'foreignField': 'uuid',
                'pipeline': [{'$project': {'fullName': 1, 'phone': 1}}],
                'as': 'rider',
            }
        },
        // Aggregate name and phone number of associated driver
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