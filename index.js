const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello")
})




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

        // ==========================================
        //                 POST API
        // ==========================================

        app.post("/add-new", async(req, res) => {
            const recivedData = req.body;
            console.log(recivedData);
            const result = await woodToyDB.insertOne(recivedData)
            res.send(result);
        })



        // ==========================================
        //                 POST API
        // ==========================================
        app.get("/products", async(req, res) => {
            const products = await woodToyDB.find().toArray();
            res.send(products);
        })
        app.get("/products/:id", async(req, res) => {
            const quary = {_id: new ObjectId(req.params)};
            const product = await  woodToyDB.findOne(quary) 
            res.send(product)
        })

        
        // my toys api 
        app.get("/my-toys", async(req, res) => {
            const email = req.body;
            let quary = {}
            if(req.query?.email){
                quary = {email: req.query.email}
            }
            const result = await woodToyDB.find(quary).toArray();
            res.send(result);
        })

        //product byCatagory

        app.get("/category", async (req, res) => {
            let query = {};
            if (req.query?.category) {
                query = { category: req.query.category };
            }
            const result = await woodToyDB.find(query).toArray();
            console.log(result);
            res.send(result);
        });



        // ==========================================
        //                 DELETE API
        // ==========================================
        app.delete("/product/:id", async(req, res) => {
            const id = req.params.id;
            const quary = {_id: new ObjectId(id)}
            const result = await woodToyDB.deleteOne(quary);
            res.send(result);
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