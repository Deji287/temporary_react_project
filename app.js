const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const { requireAuth, checkUser } = require("./middleware/authMiddleWare");

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI =
  "mongodb+srv://Pat:Ehis@jwt-auth.seikzk5.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
  })
  .then(
    (result) => app.listen(5000),
    console.log("Database connected and up and running")
  )
  .catch((err) => console.log(err));

// routes
app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.use(authRoutes);

// cookies

app.get("/set-cookies", (req, res) => {
  // res.setHeader("set-cookie", "newUser=true");

  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  res.send("Now you have got some cookies");
});

app.get("/read-cookies", (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);

  res.json(cookies);
});
