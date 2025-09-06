const createChangeListener = require("./change-listener/change-listener");

const changeListener = createChangeListener();

changeListener.start();

changeListener.addSubscriber(console.log);

// Result -> (something like this):
// {
//     update: { rideRequestStatus: 400 },
//     riderData: {
//         _id: new ObjectId("68b9b123d39ea1346abdd5e8"),
//             fullName: 'John Doe',
//             phone: '000-000-0000'
//     },
//     driverData: {
//         _id: new ObjectId("68ba41e27bdba773aa7b2ab8"),
//             fullName: 'Jane Doe',
//             mobilePhone: '555-555-5555'
//     }
// }
