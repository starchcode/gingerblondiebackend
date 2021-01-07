# The Ginger Blondie Bakery (Back-End)
> Back-End app for [my react project](https://github.com/starchcode/gingerblondiebakery) which is for a food brand based in Dublin, Ireland.

&nbsp;

## [Click to visit the website](https://thegingerblondie.ie)

&nbsp;

## Table of contents
* [General info](#general-info)
* [Features](#features)
* [Important Packages Used](#important-packages-used)
* [Status](#status)
* [Inspiration](#inspiration)
* [Contact](#contact)

## General info

I created this Back-End app using ExperssJS. App is responsible for automated tasks as well as handling API calls. It automatically renews the Instagram Token which can expire in 60 days!

## Features

* __Fetch data from client's Instagram__ to be delivered to front-end.
* __Handling contact form__ with use of [nodemailer](https://www.npmjs.com/package/nodemailer). _messages will be delivered to client's gmail_.
* __API calls to Mailchimp newsletter__. App will check wheather users are subscribed or not then shows the appropriate message!
* __Fetch all the data from Wordpress API__ that need to be loaded on the website _(blog, recipes & food)_.
* __Automation tasks__ such as renewing Instagram Token which can expire within 60 days if not renewed. A copy of the token will be sent to Admin's email!

## Important Packages Used

* [nodemailer](https://www.npmjs.com/package/nodemailer): _For sending emails._
* [mailchimp](https://github.com/mailchimp/mailchimp-marketing-node): _provided by mailchimp. An easy way to handle API calls._
* [express-rate-limit](https://www.npmjs.com/package/express-rate-limit): _To control limit of API calls in case some bot try to be naughty!_
* [node-cron](https://www.npmjs.com/package/node-cron): _For handling automated tasks._
* [node-fetch](https://www.npmjs.com/package/node-fetch): _For fetching data._

## Status

![progress](https://img.shields.io/badge/Finished!-brightgreen 'progress')

## Contact

Created by Dave Raspberry - feel free to [contact me](mailto:starchcode@gmail.com) If you have any questions. I would be glad to help 🥸