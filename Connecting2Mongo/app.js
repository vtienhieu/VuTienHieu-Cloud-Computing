var express = require("express");
const engines = require("consolidate");
var app = express();
var fs = require("fs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");
//localhost:500

var MongoClient = require("mongodb").MongoClient;
var url = "mongodb+srv://hieuvt167:16752hhH@cluster0.hnibb.mongodb.net/test";

app.get("/", async function (req, res) {
  let client = await MongoClient.connect(url); // await doi cho den khi hoan thanh truoc khi thuc hien tiep
  let dbo = client.db("MyShopDb"); // MyShopDb la ten csdl neu khong co se tao moi
  let result = await dbo.collection("MyShop").find({}).toArray();
  res.render("index", { model: result });
});

app.get("/insert", async (req, res) => {
  res.render("insert");
});

app.post("/doInsert", async (req, res) => {
  let inputName = req.body.txtName;
  let inputPrice = req.body.txtPrice;
  let inputImage = req.body.txtImage;
  let inputDes = req.body.txtDes;
  if (inputName.length < 4 && isNaN(inputPrice)) {
    let errorModel = {
      nameError: "Name must be grater than 3 character!",
      priceError: "Price must be number",
    };
    res.render("insert", { model: errorModel });
  } else if (inputName.length < 4) {
    let errorModel = {
      nameError: "Name must be grater than 3 character!",
    };
    res.render("insert", { model: errorModel });
  } else if (isNaN(inputPrice)) {
    let errorModel = {
      priceError: "Price must be number",
    };
    res.render("insert", { model: errorModel });
  } else {
    let newMyShop = {
      name: inputName,
      Price: inputPrice,
      Image: inputImage,
      Description: inputDes,
    }; // gan gia tri
    let client = await MongoClient.connect(url); // await doi cho den khi hoan thanh truoc khi thuc hien tiep
    let dbo = client.db("MyShopDb"); // MyShopDb la ten csdl neu khong co se tao moi
    await dbo.collection("MyShop").insertOne(newMyShop); // MyShop la ten bang neu khong co se tao moi
    res.redirect("/");
  }
});

app.post("/doSearch", async (req, res) => {
  let inputName = req.body.txtName;
  let client = await MongoClient.connect(url);
  let dbo = client.db("MyShopDb");
  let results = await dbo
    .collection("MyShop")
    .find({
      name: { $regex: new RegExp(inputName, "i") },
    })
    .toArray();
  res.render("index", { model: results });
});

app.get("/delete", async (req, res) => {
  let inputId = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("MyShopDb");
  let condition = { _id: ObjectID(inputId) };
  await dbo.collection("MyShop").deleteOne(condition);
  res.redirect("/");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);

// app.get("/update", async (req, res) => {
//   res.render("update");
// });

// app.post("/doUpdate", async (req, res) => {
//   let inputId = req.query.id;
//   // var item = {
//   //   name: req.body.newtxtName,
//   //   weight: req.body.newtxtWeight,
//   // };
//   var ObjectID = require("mongodb").ObjectID;

//   let inputName = req.body.newtxtName;
//   let inputPrice = req.body.newtxtWeight;
//   let newMyShop = { name: inputName, weight: inputPrice }; // gan gia tri vao cot name va weight
//   let condition = { _id: ObjectID(inputId) };

//   let client = await MongoClient.connect(url); // await doi cho den khi hoan thanh truoc khi thuc hien tiep
//   let dbo = client.db("MyShopDb"); // MyShopDb la ten csdl neu khong co se tao moi
//   await dbo
//     .collection("MyShop")
//     .updateOne({ _id: ObjectID(inputId) }, { $set: newMyShop }); // MyShop la ten bang neu khong co se tao moi

//   res.redirect("/");
// });
