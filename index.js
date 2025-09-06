const createRideRequestChangeListener = require("./change-listener/change-listener");

// Connects itself to the database and listens for changes.
// All you need is an .env file placed at the root level of this repo, containing:
// MONGODB_URI="YOUR_CONNECTION_STRING_FROM_RIDE_REQUEST_MVP_PROJECT"
const changeListener = createRideRequestChangeListener();

// changeListener API is simple:
//      addSubscriber((event) => {})
//      start()
//
// start is async but fast and doesn't need to be waited for.
// start and addSubscriber can be done in any order.
//
// The callback function passed to addSubscriber is called whenever
// an entry in the ride-request collection is changed. The callback
// receives an event
// in this form:
// {
//     changedFields: { rideRequestStatus: 1000, rideStatus: 100 },  <-- new value
//     riderData: {
//         _id: new ObjectId("68b9b123d39ea1346abdd5e8"),  <-- added by Mongo and can't be omitted, ok whatever
//         fullName: 'John Doe',
//         phone: '000-000-0000'
//     },
//     driverData: {
//         _id: new ObjectId("68ba41e27bdba773aa7b2ab8"),
//         fullName: 'Jane Doe',
//         mobilePhone: '555-555-5555'
//     }
// }
//
// You can test it by assigning drivers or starting rides on the MVP app,
// or (faster) just manually editing fields on the Atlas web interface.

// Usage example:

changeListener.addSubscriber(console.log);
changeListener.start();

// Result -> (something like this):
// {
//     changedFields: { rideRequestStatus: 1000, rideStatus: 100 },
//     riderData: {
//         _id: new ObjectId("68b9b123d39ea1346abdd5e8"),
//         fullName: 'John Doe',
//         phone: '000-000-0000'
//     },
//     driverData: {
//         _id: new ObjectId("68ba41e27bdba773aa7b2ab8"),
//         fullName: 'Jane Doe',
//         mobilePhone: '555-555-5555'
//     }
// }

