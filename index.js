const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ky8ebme.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // collection reference
    const coffeeCollection = client.db('espressoEmporium').collection('coffees');
    const usersCollection = client.db('espressoEmporium').collection('users');

    // GET coffees
    app.get('/coffees',  async (req,  res) => {
      const result = await coffeeCollection.find().toArray();
      res.send(result);
    });
    // GET users
    app.get('/users',  async (req,  res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // GET coffee
    app.get('/coffees/:id',  async (req,  res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    // POST coffee    
    app.post('/coffees', async (req, res) => {
      const newCoffee = req.body;
      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result);
    });
    // POST users
    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    // PUT coffee
    app.put('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = {
        $set: updatedCoffee
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options);
      res.send(result);
    } );

    // PATCH users
    app.patch('/users/', async (req, res) => {
      const { email, lastSignInTime } = req.body;
      const filter = { email: email };
      const updateUser = {
        $set: {
          lastSignInTime: lastSignInTime
        }
      };
      const result = await usersCollection.updateOne(filter, updateUser);
      res.send(result);
    });

    // DELETE coffee
    app.delete('/coffees/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
    // DELETE users
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Welcome to Espresso Emporium API. Coffee server is hitting up!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});