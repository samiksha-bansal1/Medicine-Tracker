const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("express-session");

const app = express();
const PORT = 9700;

// Database Connection
mongoose.connect("mongodb://127.0.0.1:27017/medicineApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));

// **Session Middleware (Move this before routes)**
app.use(session({
  secret: "your_secret_key",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day session
}));

// Import Routes
const authRoutes = require("./Medicine-Tracker/med remind/routes/auth");
const presRoutes = require("./Medicine-Tracker/med remind/routes/pres");

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
