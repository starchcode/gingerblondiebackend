const nodemailer = require("nodemailer");
const express = require("express");
const fs = require("fs");
const fetch = require("node-fetch");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const rateLimit = require("express-rate-limit");
const cors = require("cors");


require("dotenv").config();
app = express();
const PORT = process.env.PORT || 4000;

// Enabling cors for certain URL 
var whitelist = ['http://localhost:3000', 'http://example2.com']
var corsOptions = {
  origin: function (origin, callback) {
    try{
      if (whitelist.indexOf(origin) !== -1) {
        console.log('CORS allowed!')
        callback(null, true)
      } else {
        console.log('CORS NOT allowed!')
        callback(null, false)
        // callback(new Error('Not allowed by CORS'))
      }
    }catch(e){
      console.log('CORS NOT ALLOWED!')
    }
  }
}
app.use(cors(corsOptions))

const limiter1 = rateLimit({
  windowMs: 2 * 1000, // 1 seconds
  max: 1, // limit each IP to 1 requests per windowMs
});
const limiter2 = rateLimit({
  windowMs: 15000, // 15 seconds
  max: 1, // limit each IP to 1 requests per windowMs
});
const limiter3 = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 1 requests per windowMs
  message: 'You have reached the maximum number of requests! Comeback later.'
});

app.use(bodyParser.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello There!");
});

const send = require("./send");
app.use("/send", limiter2, send);
// const ren = require('./ren');
// app.use('/ren', limiter2, ren);
const igdata = require("./igdata");
app.use("/igdata", limiter1, igdata);
const contact = require("./contact");
app.use("/contact", limiter1, limiter3, contact);
const newsletter = require("./newsletter");
app.use("/newsletter", newsletter);

const wp = require("./wp");
app.use("/wp", limiter1, wp);

/*tasks for server*/

// test
const {tester, jwtRenewer, igTokenRenew} = require('./automation')
// cron.schedule("*/3 * * * * *", tester)

// token renewal for wordpress
cron.schedule("0 0 * * *", jwtRenewer);
cron.schedule("0 0 28,5 * *", igTokenRenew);



// route error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;

const DATA = `-------------------
'we recieved an error @ ${new Date().toUTCString()} ${status}
here is your error:
${err}
-------------------
`
console.log(DATA)
  fs.appendFile('error.txt', DATA, function (err) {
    if (err) throw err;
    console.log('Saved!');
  });

  res.status(status).send(err.message);
});



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
