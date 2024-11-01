const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port =process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w8b4lyk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const menucollection = client.db("resturentDb").collection("menu");
    const usercollection = client.db("resturentDb").collection("users");
    const reviewscollection = client.db("resturentDb").collection("reviews");
    const cardscollection = client.db("resturentDb").collection("cards");
    // uesr related api
    app.get('/users',async(req,res)=>{
       const result = await usercollection.find().toArray();
       res.send(result);
    })
    
    app.post('/users',async(req,res)=>{
      const user = req.body;
      // inser email if user doesn't exixts
      // you can dot this many ways (1.email unique,2.upsert,3.Simple Checking)
      const query = {email: user.email}
      const exisytingUser = await usercollection.findOne(query);
      if(exisytingUser){
        return res.send({message:'user already exists',insertedId:null})
      }
      const result = await usercollection.insertOne(user);
      res.send(result);
    })
    app.get('/menu',async(req,res)=>{
      const result = await menucollection.find().toArray();
      res.send(result);
    })
    app.get('/reviews',async(req,res)=>{
      const result = await reviewscollection.find().toArray();
      res.send(result);
    })
    // cards collection
    app.get('/cards',async(req,res)=>{
      const email = req.query.email;
      const query = {email:email};
      const result = await cardscollection.find(query).toArray();
      res.send(result);

    })
    app.post('/cards',async(req,res)=>{
      const cardsItem = req.body;
      const result = await cardscollection.insertOne(cardsItem);
      res.send(result)

    });
    app.delete('/carts/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await cardscollection.deleteOne(query);
      res.send(result);
    })

    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res) =>{
    res.send('boss is siting')
})
app.listen(port, () =>{
    console.log(`react-project sitting on port ${port}`);
})
