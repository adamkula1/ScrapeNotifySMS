//Packages
const axios = require("axios");
const cheerio = require("cheerio");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const url =
  "HERE PRODUCT URL";

const product = { name: "", price: "", link: "" };

//Set interval
const handle = setInterval(scrape, 10000);

async function scrape() {
  //Fetch the data
  const { data } = await axios.get(url);
  //Load up the html
  const $ = cheerio.load(data);
  const item = $(".npp-sidebar");
  //Extract the data that we need
  product.name = $(item).find(".product-title").text();
  product.link = url;

  const price = $(item)
    .find(".product-price .current-price")
    .text()
    // .replace(/[,.]/g, "");
    .replace(/,/g, ".", "€", "");

  const priceNum = parseFloat(price);
  product.price = priceNum;
  console.log(product);

  //Send an SMS
  if (priceNum < 70) {
    client.messages
      .create({
        body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: "HERE NUMBER FROM TWILIO",
        to: "HERE MY NUMBER",
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
  }
}

//Run script --> node scraper.js
