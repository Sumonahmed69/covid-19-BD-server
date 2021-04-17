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

  app.post('/addAService', (req, res) => {
    const file = req.files.file;
    const name = req.body.name;
    const email = req.body.email;
    console.log(file, name, email)
    file.mv(`${__dirname}/serivec/${file.name}`, err => {

      if(err){
        console.log(err)
        return res.status(500).send({messg : 'failed upload img' })
      }
      return res.send({name: file.name, path: `/${file.name}`})
    });



    app.get('/service', (req, res) => {
      doctorCollection.find({})
          .toArray((err, documents) => {
              res.send(documents);
          })
  });
   
    



    })

});

app.listen(process.env.PORT || port);