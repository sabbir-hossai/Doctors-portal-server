const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l12hi.mongodb.net/doctors-portal?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("doctors-portal");
        const bookingCollection = database.collection("doctors-booking");

        app.post('/appointments', async (req, res) => {
            const appointment = req.body;
            console.log(appointment)
            const result = await bookingCollection.insertOne(appointment);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
            res.json(result)
        })
        app.get('/appointments', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = bookingCollection.find(query)
            const appointments = await cursor.toArray();
            res.json(appointments)
        })
        // app.get('/appointments', async (req, res) => {
        //     const email = req.query.email;
        //     const date = new Date(req.query.date).toLocaleDateString();

        //     const query = { email: email, date: date }

        //     const cursor = appointmentsCollection.find(query);
        //     const appointments = await cursor.toArray();
        //     res.json(appointments);
        // })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello doctors portal')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})