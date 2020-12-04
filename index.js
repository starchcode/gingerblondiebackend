const nodemailer = require("nodemailer");
const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cron = require('node-cron');
const rateLimit = require("express-rate-limit");
const cors = require('cors')
require("dotenv").config();
app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

const limiter1 = rateLimit({
  windowMs: 1000, // 15 seconds
  max: 1, // limit each IP to 1 requests per windowMs
});
const limiter2 = rateLimit({
  windowMs: 15000, // 15 seconds
  max: 1, // limit each IP to 1 requests per windowMs
});
app.use(bodyParser.json());
app.use(morgan("dev"));


app.get("/", (req, res) => {
  res.send("Hi");
});

const send = require('./send');
app.use('/send', limiter2, send);
// const ren = require('./ren');
// app.use('/ren', limiter2, ren);
const igdata = require('./igdata');
app.use('/igdata', limiter1, igdata);
const contact = require('./contact');
app.use('/contact', limiter1, contact);
const newsletter = require('./newsletter');
app.use('/newsletter', newsletter);


app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.log('here is your ERROR: ' + err.message)
  res.status(status).send(err.message);
})


// cron.schedule('0,10,20,30,40,50 * * * * *', function() {
//   console.log('---------------------');
//   console.log('Running Cron Job');
//   console.log('process KEY before: ' + process.env.KEY)
//   let num = Number(process.env.KEY)
//   process.env.KEY = num + 1
//   let texts= `IG_API_KEY=${process.env.IG_API_KEY} 
//   APP_ID=${process.env.APP_ID} 
//   APP_SECRET=${process.env.APP_SECRET}
//   GMAIL=${process.env.GMAIL}
//   PASS=${process.env.PASS}
//   KEY=${process.env.KEY}`
//   fs.writeFile('.env', texts, function (err) {
//     if (err) throw err;
//   });
// console.log(process.env.KEY);
// });

// app.get('/getkey', (req, res)=>{

// console.log(process.env.KEY);

// res.send('check console!');
// })

app.listen(PORT, () => {
  console.log("App started... on 4000");
});
