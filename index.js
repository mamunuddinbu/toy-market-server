const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nekc4yh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const toysCollection = client.db("toysData").collection("toysCollection");

    app.post("/toys", async (req, res) => {
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    });

    app.get("/toys", async (req, res) => {
      const query = {};
      const toys = await toysCollection.find(query).toArray();
      res.send(toys);
    });


    // app.get("/toys/seller/:sellerEmail", async (req, res) => {
    //   const { sellerEmail } = req.params;
    //   const query = { sellerEmail:sellerEmail };
    //   const toys = await toysCollection.find(query).toArray();
    
    //   if (toys.length === 0) {
    //     res.status(404).json({ message: "Toys not found for the seller" });
    //     return;
    //   }
    
    //   res.send(toys);
    // });
    app.get("/toys/email/:email", async (req, res) => {
      const query = { sellerEmail: req.params.email };
      const result = await toysCollection.find(query).toArray();
      res.send(result);
    });
    

  

    app.get("/toys/id/:id", async (req, res) => {
      const { id } = req.params;
      const toy = await toysCollection.findOne({ _id: new ObjectId(id) });
    
      if (!toy) {
        res.status(404).json({ message: "Toy not found" });
        return;
      }
    
      res.send(toy);
    });
    


   

    app.put("/toys/update/id/:id", async (req, res) => {
      const { id } = req.params;
      const updatedToy = req.body;
      const result = await toysCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedToy }
      );

      if (result.modifiedCount === 0) {
        res.status(404).json({ message: "Toy not found" });
        return;
      }

      res.json({ message: "Toy updated successfully" });
    });

    app.delete("/toys/:id", async (req, res) => {
      const { id } = req.params;
      const result = await toysCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Toy not found" });
        return;
      }

      res.json({ message: "Toy deleted successfully" });
    });

    // ...

  } finally {
  }
}

run().catch((error) => console.error(error));

// By default
app.get("/", (req, res) => {
  res.send("Toy server is running");
});

app.listen(port, () => {
  console.log(`Toy server is running on port ${port}`);
});


// const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// require("dotenv").config();
// console.log(process.env.DB_PASS);

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/?retryWrites=true&w=majority`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();

//     const serviceCollection = client.db("carDoctor").collection("services");
//     const bookingCollection = client.db("carDoctor").collection("bookings");

//     app.get("/services", async (req, res) => {
//       const cursor = serviceCollection.find();
//       const result = await cursor.toArray();
//       res.send(result);
//     });
// app.get("/toys/:id", async (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   const toy = await toysCollection.findOne({ _id: new ObjectId(id) });

//   if (!toy) {
//     res.status(404).json({ message: "Toy not found" });
//     return;
//   }

//   res.send(toy);
// });

//     app.get("/services/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };

//       const options = {
//         // Include only the `title` and `imdb` fields in the returned document
//         projection: { title: 1, price: 1, service_id: 1, img: 1 },
//       };

//       const result = await serviceCollection.findOne(query, options);
//       res.send(result);
//     });

//     // bookings
//     app.get("/bookings", async (req, res) => {
//       console.log(req.query.email);
//       let query = {};
//       if (req.query?.email) {
//         query = { email: req.query.email };
//       }
//       const result = await bookingCollection.find(query).toArray();
//       res.send(result);
//     });





//     app.post("/bookings", async (req, res) => {
  //       const booking = req.body;
  //       console.log(booking);
  //       const result = await bookingCollection.insertOne(booking);
  //       res.send(result);
  //     });

//     app.patch("/bookings/:id", async (req, res) => {
//       const id = req.params.id;
//       const filter = { _id: new ObjectId(id) };
//       const updatedBooking = req.body;
//       console.log(updatedBooking);
//       const updateDoc = {
//         $set: {
//           status: updatedBooking.status,
//         },
//       };
//       const result = await bookingCollection.updateOne(filter, updateDoc);
//       res.send(result);
//     });

//     app.delete("/bookings/:id", async (req, res) => {
//       const id = req.params.id;
//       const query = { _id: new ObjectId(id) };
//       const result = await bookingCollection.deleteOne(query);
//       res.send(result);
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);