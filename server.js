const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection string
const url = 'mongodb+srv://sanjudddd400:Sanjay@mycluster.v8s6r.mongodb.net/user?retryWrites=true&w=majority&appName=MyCluster';
const client = new MongoClient(url);

// Database and collection names
const dbName = 'user'; // Make sure this database exists
const collectionName = 'details'; // Make sure this collection exists

// Serve a simple HTML form for testing
app.get('/', (req, res) => {
  res.send(`
    <form action="/submit" method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name" required><br><br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email" required><br><br>
      <button type="submit">Submit</button>
    </form>
  `);
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const { name, email } = req.body;

  console.log('Received form data:', { name, email });

  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await client.connect();

    console.log('Connected to MongoDB');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert data into MongoDB
    console.log('Inserting data into collection...');
    const result = await collection.insertOne({ name, email });
    console.log('Data inserted:', result.insertedId);

    res.send('<h1>Form submitted successfully!</h1>');
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).send('Error saving data to the database.');
  } finally {
    console.log('Closing MongoDB connection');
    await client.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
