const nodemailer = require("nodemailer");
const contact = require("express").Router();
const bodyParser = require("body-parser");
const fetch = require('node-fetch');
var SECRET_KEY = process.env.CAPTCHA_SECRET_KEY

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


contact.post('/', async (req, res)=>{

    const bodyHTML=`
    <b>Hello admin,</b> <br> <br>
    
    here is a new message. reply by clicking on the email or copy and paste it in your form!<br><br>

    Full name: ${req.body.fullName}<br>
    Email: <a href="mailto:${req.body.email}">${req.body.email}</a><br>
    Phone: ${req.body.phone}<br>
    Enquiry: <br>" <em>${req.body.enquiry}</em>"
`
var VERIFY_URL = `https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY}&response=${req.body['g-recaptcha-response']}`;
return fetch(VERIFY_URL, { method: 'POST' })
  .then(response => response.json())
  .then(response => {
      if(response.score > 0.6 && req.body.enquiry){
          console.log(response.score)
          let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.GMAIL, // generated ethereal user
              pass: process.env.PASS, // generated ethereal password
            },
          });
  

        let info = transporter.sendMail(
        {
          from: "<starchcode@gmail.com>", // sender address
          to: "mrdave67@gmail.com", // list of receivers
          subject: `${req.body.fullName} has sent you a message!`, // Subject line
          html: bodyHTML
        },  function (err, data) {
          if (err) {
            console.log("error: email did not send", err);
            res.status(404).send('Your message was not sent! try again later332.');
          } else {
              console.log('email sent!')
            res.send({result: 'Thank you! Your message was sent.'});
          }
        })

    }else if(response.score > 0.6 && req.body.emailNewsletter){
      console.log(response.score)
      
      console.log('newsletter request received!')
      // res.redirect('/newsletter')
      res.redirect(307, '/newsletter');
    }else { console.log(response)}
        //  res.send('not authorized!') 
  })
  



})

module.exports = contact;