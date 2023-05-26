const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello")
})



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://detectiveseo1:BfLoIRko0w8IT2oP@cluster0.darcm8e.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const woodToyDB = client.db("Products").collection("Wooden_Toy")

async function run() {
    try {
        app.get("/products", async(req, res) => {
            const products = await woodToyDB.find().toArray();
            res.send(products);
        })
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`your port is running on ${port}`)
})