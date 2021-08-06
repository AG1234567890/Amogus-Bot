const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
 if (error) {
 return console.log('Unable to connect to database!')
 }
 const db = client.db(databaseName)
 console.log("Connected to the database at "+connectionURL)
 // Start to interact with the database
})