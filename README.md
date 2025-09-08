# Install

Add the database folder to your project, add these dependencies to your package.json file:
```
"dotenv": "^16.3.1",
"mongodb": "5.9.2",
"mongoose": "^7.5.0"
```

and run `npm install`.
        
# Use

In your code, import with
`const createDatabaseApi = require("./database/api");`
as demonstrated in index.js.

Instantiate with `const database (or whatever) = createDatabaseApi();
`

# API

`async database.connect()` - Starts connection with database.

`database.onChange(change => {})` - Calls your callback whenever a ride request is changed (from the dashboard, on the Atlas web UI, programmatically, etc.). Your callback function receives an object that looks like this (example):
```
{
    rideRequestKey: {new ObjectId("68b9b123d39ea1346abdd5e8")
    changedFields: { rideRequestStatus: 1000, rideStatus: 100 },  <-- new value
}
```

`database.fetchAssociatedRiderAndDriverDataFromRideRequest(rideRequestKey)` - Looks up the driver and rider name and phone number associated with the ride request. Pass it the ride request key from the above callback. Response will look like this (example):
```
{
    riderData: {
        _id: new ObjectId("68b9b123d39ea1346abdd5e8"),
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

`database.update(rideRequestKey, fieldsToChange)` - Updates a field or fields in the database. fieldsToChange should look like this:
```
{field1Name: newValue, fieldName2: newValue ... fieldNameN: newValue}
```

index.js shows usage examples.
