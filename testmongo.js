const { MongoClient } = require("mongodb");
const express = require("express");

const app = express();
const port = 3000;

// ✅ Updated MongoDB URI with TLS fix
const uri = "mongodb+srv://eachristian335:CMPS415PW@cmps415-edawrd.4m3amxt.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true";

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server started at http://localhost:${port}`);
});

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Server is running.");
});

// ✅ Test greeting
app.get("/say/:name", (req, res) => {
  res.send(`Hello ${req.params.name}!`);
});

// ✅ MongoDB lookup route
app.get("/api/mongo/:item", async (req, res) => {
  const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true
  });

  const searchKey = req.params.item;
  console.log(`🔍 Searching for document with name: ${searchKey}`);

  try {
    await client.connect();
    const db = client.db("cmps415");
    const collection = db.collection("cmps");

    const query = { name: searchKey };
    const result = await collection.findOne(query);

    if (result) {
      console.log("✅ Document found:", result);
      res.status(200).send("Found this: " + JSON.stringify(result));
    } else {
      console.log("❌ No document found with that name.");
      res.status(404).send("No document found with that name.");
    }
  } catch (err) {
    console.error("❗️MongoDB error:", err.message);
    res.status(500).send("Error accessing database.");
  } finally {
    await client.close();
  }
});
