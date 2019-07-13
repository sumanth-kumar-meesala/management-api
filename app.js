const express = require("express");
const bodyParser = require("body-parser");
const userRoute = require("./routes/user.route");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://sumanth:sumanth@managementcluster-a9tr3.mongodb.net/modern?retryWrites=true",
  {
    useCreateIndex: true,
    useNewUrlParser: true
  },
  function(err, client) {
    if (err) {
      console.log(err);
    }
    console.log("MongoDB Connected");
  }
);

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// app.use(
//   cors({
//     origin: function(origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) === -1) {
//         var msg =
//           "The CORS policy for this site does not " +
//           "allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     }
//   })
// );

app.get("/", (req, res) => {
  res.send("Bring it on! Management API is running.");
});

app.use("/user", userRoute);

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log("management API up and running " + port);
});
