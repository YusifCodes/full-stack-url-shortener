const express = require("express");
const mongoose = require("mongoose");
const app = express();
const ShortUrl = require("./models/shortUrl");

app.use("/public/styles", express.static(__dirname + "/public/styles"));
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// RENDER INDEX.JS AND PASS allData
app.get("/", async function(req, res) {
  try {
    let allData = await ShortUrl.find()
    res.render("index",{shortUrls: allData});
  } catch (err) {
    console.error(err);
  }
});

// HANDLE SHORT URL CREATION
app.post("/shortUrls", async function(req, res) {
  const record = new ShortUrl({
    full: req.body.fullUrl,
  });
  await record.save(function(err, data) {
    if (err) return console.error(err);
  });
  res.redirect("/");
});

// HANDLE REDIRECTION 
app.get("/:shorturl", async (req, res) => {
  const shortid = req.params.shorturl
  const rec = await ShortUrl.findOne({ short: shortid })
  if (!rec) {
    res.sendStatus(404)
    return
  }
  res.redirect(rec.full)
})

// MONGODB
const uri = "YOUR MONGODB ACCESS URI";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.connection.on("open", () => {
  app.listen(process.env.PUBLIC_PORT || 5000, () => {
    ShortUrl.deleteMany().then(() => {
      console.log("Model cleared")
    })
    console.log("Server started");
  });
});
