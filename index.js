const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const port = 5000
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.srgur.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const productCollection = client.db("duckMeat").collection("allProducts");
  const placeOrder = client.db("duckMeat").collection("allOrders");

  app.post("/admin/addProduct", (req, res) => {
    const productAddeded = req.body;
    productCollection.insertOne(productAddeded)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post("/orderSubmit", (req, res) => {
    const orderSubmit = req.body;
    placeOrder.insertOne(orderSubmit)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/yourOrders/:email', (req, res) => {
    placeOrder.find({email: req.params.email})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

  // client.close();
});





app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})