const newsletter = require("express").Router();
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
const bodyParser = require('body-parser')

// parse application/json
newsletter.use(bodyParser.json());
// parse application/x-www-form-urlencoded
newsletter.use(bodyParser.urlencoded({ extended: true }));
//todo: 
//CREATE FRONT END
//RIDIRECT FROM CONTACT

const listId = process.env.MAIL_LISTID;
mailchimp.setConfig({
  apiKey: process.env.MAIL_API,
  server: "us7",
});

async function subscriber(emailRequest, name) {
  try {
    const subscribingUser = {
      firstName: name,
      email: emailRequest,
    };
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "pending",
      merge_fields: {
        FNAME: subscribingUser.firstName,
      },
    });

    console.log(
      `Confirmation email was sent to contact with the id:  ${response.id}.`
    );
  } catch (e) {
    console.log("issue!", e.message, e.status);
      return('Bad request: There was a problem. You can drop me your email through the contact form so I can subscribe you! or Try again later.')
  }
}

async function archiveUser(listId, Hash, emailRequest) {
  const response = await mailchimp.lists.deleteListMember(listId, Hash);
}

const update = async (listId, Hash, status) => {
  try {
    const response = await mailchimp.lists.updateListMember(listId, Hash, {
      status: status,
    });
    console.log(response.status);
  } catch (e) {
    console.log(e.status);
    console.log(e);
  }
};

newsletter.post("/", async (req, res) => {
    const matchName = req.body.nameNewsletter.split(' ')[0];

    const name = req.body.nameNewsletter;
  const emailRequest = req.body.emailNewsletter;
  const subscriberHash = md5(emailRequest.toLowerCase());
    console.log('You are redirected to newsletter!')

  try {
    const response = await mailchimp.lists.getListMember(
      listId,
      subscriberHash
    );

    console.log(`This user's subscription status is ${response.status}.`);


    if (response.status === "subscribed") { //DONE
      // await archiveUser(listId, subscriberHash);
      res.send({ result: "You are already subscribed!", 
    type: 'subscription' });

    } else if (response.status === "pending") { //DONE
      console.log("going to archive first...");
      await update(listId, subscriberHash, 'unsubscribed');
      await archiveUser(listId, subscriberHash);
      const action = await subscriber(emailRequest, name); 
      res.send({
        result:
          action || "We have sent you 'ANOTHER' email. please go to your email and confirm your subscription!",
        type:'subscription'
      });
    } else if (response.status === "archived") {
        const action = await subscriber(emailRequest, name); 
      res.send({
        result:
          action || "We have sent you an email. please go to your email and confirm your subscription!",
          type:'subscription'
      });
    } else if (response.status === "unsubscribed") {
      //archive it first!
      console.log("this email is unsubscribed");
      await archiveUser(listId, subscriberHash);
      const action = await subscriber(emailRequest, name); 

      res.send({ result: action || "We have sent you an email. please go to your mailbox and confirm your subscription!",
    type:'subscription' });
    }
  } catch (e) { //DONE
    if (e.status === 404) {
      console.log(`This email is not subscribed to this list`);

      //let's added it the list!
      const action = await subscriber(emailRequest, name); 
      res.send({
        result:
          action || "We have sent you an email. please go to your mailbox and confirm your subscription!",
          type:'subscription'
      });
    }else{
        res.send('')
    }
  }
});

module.exports = newsletter;
