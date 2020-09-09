const functions = require("firebase-functions");
const express = require("express");

const admin = require("firebase-admin");
admin.initializeApp();

// Init Realtime Database
const db = admin.database();
const ref = db.ref("users");

const app = express();

app.get("/", async (req, res) => {
  const data = await ref.once("value");
  const value = !Object.values(data.val()).every(val => !val);

  res.status(200).send({
    postfix: "Busy bulb",
    color: value ? "red" : "green",
    data: {
      value: value ? "Busy" : "Available"
    }
  });
});

app.get("/:id", async (req, res) => {
  const user = await ref.child(req.params.id).once("value");

  res.status(200).send(user);
});

exports.status = functions.https.onRequest(app);
