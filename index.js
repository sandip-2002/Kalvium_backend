const express = require("express");
const math = require("mathjs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const History = require("./models/History");
const app = express();
const port = 3000;

dotenv.config();

const handleHistory = async (obj) => {
  const createdAns = new History(obj);
  try {
    const savedAns = await createdAns.save();
    console.log(savedAns);
  } catch (error) {
    return false;
  }
};
app.get("/", (req, res) => {
  const htmlContent =
    "<ul><li>/history</li><li>/5/plus/3</li><li>/3/minus/5</li><li>/3/minus/5/plus/8</li><li>/3/into/5/plus/8/into/6</li></ul>";
  res.send(htmlContent);
});
app.get("/history", async (req, res) => {
  try {
    const history = await History.find().sort({ createdAt: -1 }).limit(20);
    console.log(history);
    const tempArr = [];
    history.forEach((item) => {
      tempArr.push({ question: item.question, ans: item.ans });
    });
    return res.send(tempArr);
  } catch (error) {
    return res.send(error);
  }
});
app.get(/^\/(.*)/, (req, res) => {
  let args = req.params[0];
  args = args.split("/");
  let str = "";
  for (var i = 0; i < args.length; i++) {
    if (args[i] === "plus") {
      str = str + "+";
    } else if (args[i] === "minus") {
      str = str + "-";
    } else if (args[i] === "into") {
      str = str + "*";
    } else if (args[i] === "by") {
      str = str + "/";
    } else {
      str = str + args[i];
    }
  }

  const result = math.evaluate(str);
  handleHistory({ question: str, ans: result });
  res.json({ question: str, ans: result });
});
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(`app is running on port ${port}`);
    });
    console.log("connected to Mongoose");
  })
  .catch((error) => {
    console.log(error);
  });
