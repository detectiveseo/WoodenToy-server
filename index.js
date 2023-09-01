require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("My server is runing good")
})


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}V@cluster0.koootga.mongodb.net/?retryWrites=true&w=majority`;


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

        app.post("/add-new", async (req, res) => {
            const recivedData = req.body;
            const result = await woodToyDB.insertOne(recivedData)
            res.send(result);
        })



        // ==========================================
        //                 POST API
        // ==========================================

        app.get("/products", async (req, res) => {
            const key = req.query.keys
            console.log(key)
            let query = {}
            if (req.query?.keys) {
                query = { name: { $regex: key, $options: "i"} }
            }
            if (req.query?.filter === "low") {
                products = await woodToyDB.find(query).sort({ price: 1 }).toArray()
            } else if (req.query?.filter === "height") {
                products = await woodToyDB.find(query).sort({ price: -1 }).toArray()
            } else {
                products = await woodToyDB.find(query).toArray();
            }
            res.send(products);
        })

        app.get("/products/:id", async (req, res) => {
            const quary = { _id: new ObjectId(req.params) };
            const product = await woodToyDB.findOne(quary)
            res.send(product)
        })


        // my toys api 
        app.get("/my-toys", async (req, res) => {
            let quary = {}
            if (req.query?.email) {
                quary = { email: req.query.email }
            }
            const result = await woodToyDB.find(quary).toArray();
            res.send(result);
        })

        // product byCatagory
        app.get("/catagory", async (req, res) => {
            let quary = {};
            if (req.query?.catagory) {
                quary = { category: req.query.catagory }
            }
            const result = await woodToyDB.find(quary).toArray();
            res.send(result)
        })

        //product by name 
        app.get("/items", async (req, res) => {
            const query = { name: { $regex: req.query.products, $options: "i" } }
            const result = await woodToyDB.find(query).toArray();
            res.send(result);
        })


        // ==========================================
        //                 Update POST API
        // =========================================
        app.patch("/update/:id", async (req, res) => {
            const updatedProduct = req.body;
            const quary = { _id: new ObjectId(req.params.id) }
            const updProduct = {
                $set: {
                    name: updatedProduct.name,
                    image: updatedProduct.image,
                    age_range: updatedProduct.age_range,
                    category: updatedProduct.catagory,
                    price: updatedProduct.price,
                    category: updatedProduct.catagory,
                    description: updatedProduct.description,
                    dimensions: { length: updatedProduct.dimensions.length, width: updatedProduct.dimensions.width, height: updatedProduct.dimensions.height }
                }
            }
            console.log(updatedProduct)
            const result = await woodToyDB.updateOne(quary, updProduct)
            res.send(result);
        })



        // ==========================================
        //                 DELETE API
        // ==========================================
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const quary = { _id: new ObjectId(id) }
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