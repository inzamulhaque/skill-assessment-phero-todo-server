const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7kpjj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db("todo").collection("task");

        app.get("/task/:email", async (req, res) => {
            const { email } = req.params;
            if (email) {
                const result = await todoCollection.find({ email }).toArray();
                res.send(result);
            } else {
                res.send({ msg: "Your Are Not Valid User" });
            }
        });

        app.post("/task", async (req, res) => {
            const task = req.body;
            const result = await todoCollection.insertOne(task);
            res.send({ success: true, result })
        });

        app.put("/task", async (req, res) => {
            const { id } = req.query;
            if (id) {
                const filter = { _id: ObjectId(id) };
                const updatedDocs = {
                    $set: { complete: true },
                };
                const result = await todoCollection.updateOne(filter, updatedDocs);
                res.send({ success: true, result });
            } else {
                res.send({ success: false });
            }
        });

        app.delete("/task", async (req, res) => {
            const { id } = req.query;
            if (id) {
                const filter = { _id: ObjectId(id) };
                const result = await todoCollection.deleteOne(filter);
                res.send({ success: true, result });
            } else {
                res.send({ success: false });
            }
        });

    } finally {

    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("ToDo App")
});

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});