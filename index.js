const express = require('express')
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// save_data
// RuvNZGoI1VSZBwoz

app.use(cors());
app.use(express.json());
// app.use(morgan("dev"));

const uri = "mongodb+srv://save_data:RuvNZGoI1VSZBwoz@cluster0.ksaovkw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    const saveDatabase = client.db("SaveData").collection("datas");
    const saveInfoCollection = client.db("SaveData").collection("saveInfo");

    app.get('/read', async (req, res) => {
      const query = {};
      const result = await saveDatabase.find(query).toArray();
      res.send(result);
    });

    app.post('/save', async (req, res) => {
      const saveInfo = req.body;
      const result = await saveInfoCollection.insertOne(saveInfo);
      res.send(result);
    });

    app.get('/saveData', async (req, res) => {
      const query = {};
      const result = await saveInfoCollection.find(query).toArray();
      res.send(result);
    });

    app.get('/saveData/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await saveInfoCollection.findOne(query);
      console.log(result);
      res.send(result);
    })

    app.put('/update/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          reportedSeller: 'ReportedSeller'
        },
      };
      const result = await saveInfoCollection.updateOne(filter, updateDoc, options);
      console.log(result);
      res.send(result);
    })

    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await saveInfoCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  }

  finally {
    // await client.close();
  }
};


run().catch(error => console.log(error));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})