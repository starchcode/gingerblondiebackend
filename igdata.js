const igdata = require('express').Router();
const fetch = require("node-fetch");

igdata.get("/", async (req, res) => {
    try {
      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,media_url,permalink,media_type&access_token=${process.env.IG_API_KEY}&limit=9`
      );
      const result = await response.json();
      return res.json({
        success: true,
        result,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  })
  
  module.exports = igdata;