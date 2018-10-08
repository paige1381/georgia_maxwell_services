const express = require("express");
import bodyParser from "body-parser";
import logger from "morgan";
import mongoose from "mongoose";
import { getSecret } from "./secrets";
import Invite from "./models/invite";

const app = express();
const router = express.Router();

const API_PORT = process.env.API_PORT || 3001;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

mongoose.connect(getSecret("dbUri"));
console.log(getSecret("dbUri"));
let db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

router.get("/", (req, res) => {
  res.json({ message: "Listening!" });
});

app.use("/api", router);

router.get("/invites", (req, res) => {
  Invite.find((err, invites) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: invites });
  });
});

router.post("/invites", (req, res) => {
  const invite = new Invite();
  const { guest, email } = req.body;
  if (!guest || !email) {
    return res.json({
      success: false,
      error: "You must provide an guest and invite"
    });
  }
  invite.guest = guest;
  invite.email = email;
  invite.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

app.listen(API_PORT, () =>
  console.log(`Listening on port ${API_PORT}`, getSecret("dbUri"))
);
