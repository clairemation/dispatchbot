Add the change-listener folder to your project, add these dependencies to your package.json file:
```
"dotenv": "^16.3.1",
"mongodb": "5.9.2",
"mongoose": "^7.5.0"
```

and run `npm install`.
        
In your code, import with
`const createRideRequestChangeListener = require("./change-listener/change-listener");`
as demonstrated in index.js.

Instantiate with `const changeListener (or whatever) = createRideRequestChangeListener();`
Then just call `changeListener.start()` and `changeListener.addSubscriber(change => {YOUR LOGIC})` on your instance.

Whenever a ride request document is changed, your callback is called.
The "change" parameter is an object that looks like this:
```
{
    changedFields: { rideRequestStatus: 1000, rideStatus: 100 },  <-- new value
    riderData: {
        _id: new ObjectId("68b9b123d39ea1346abdd5e8"),  <-- added by Mongo and can't be omitted, ok whatever
        fullName: 'John Doe',
        phone: '000-000-0000'
    },
    driverData: {
        _id: new ObjectId("68ba41e27bdba773aa7b2ab8"),
        fullName: 'Jane Doe',
        mobilePhone: '555-555-5555'
    }
}
```

You can test it by assigning drivers/vehicles or starting rides on the MVP app, or (faster) just manually editing fields on the Atlas web interface.

index.js shows a usage example.
