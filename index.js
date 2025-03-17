const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 5000;

// Database Connection
const { connectMongoDB } = require("./connection");
const MONGO_URL = "mongodb://127.0.0.1:27017/medicineApp";
connectMongoDB(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Mongo DB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static("public"));

// **Session Middleware (Move this before routes)**
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day session
  })
);

// Import Routes
const authRoutes = require("./routes/auth");
const presRoutes = require("./routes/pres");

// **Use Routes (after middleware)**
app.use("/auth", authRoutes);
app.use("/pres", presRoutes);

// Root Route → Redirect to Login
app.get("/", (req, res) => {
  res.redirect("/auth/login");
});

// Server Listening
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
