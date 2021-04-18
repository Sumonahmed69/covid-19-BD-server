const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0tnqn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('service'));
app.use(fileUpload());





const port = 5000


app.get('/', (req, res) => {
  res.send('Server Home is Working db ')

})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {

  const appointmentCollection = client.db("covid-19BD").collection("appointment");
  const doctorCollection = client.db("covid-19BD").collection("service");


  app.post('/addAppointment', (req, res) => {
    const appointment = req.body;
    appointmentCollection.insertOne(appointment)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  });



  app.post('/appointmentByDate', (req, res) => {
    const date = req.body;
    console.log(date.date)
    appointmentCollection.find({ date: date.date })
      .toArray((err, documnets) => {
        res.send(documnets);
      })
  });



  app.post('/addService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    doctorCollection.insertOne({ name, email, image })
        .then(result => {
            res.send(result.insertedCount > 0);
        })
})

    




});

app.listen(process.env.PORT || port);