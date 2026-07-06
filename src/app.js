const express = require("express");
const connectDB = require("./config/database");
const app = express();
const port = 3000;

const User = require("./models/user");
const Vehicle = require("./models/vehicle");

const { authenticate, authorize } = require("./middlewares/auth");
const { validateSignupData, validateLoginData } = require("./validators/auth");
const bycrypt = require("bcrypt");

// Apply authentication middleware to all routes
app.use(authenticate);
// Apply authorization middleware to specific routes

app.use(express.json());

// User signup
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Validate signup data
    const validation = validateSignUpData(req.body);
    if (!validation.isValid) {
      return res.status(400).json(validation?.errors);
    }
    //Encrypt password
    const passwordHash = await bycrypt.hash(password, 10);
    // Create new instance of User model and save to database
    const user = new User({
      name,
      email,
      password: passwordHash,
      role: role || "user",
    });
    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err?.errors[field]?.message;
      }
      return res.status(400).json(errors);
    }
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// User login
app.post("/login", async (req, res) => {
  try{
    //validate login data
    const { email, password } = req.body;
    const validateLoginData = validateLoginData(req.body);
    if (!validateLoginData.isValid) {
      return res.status(400).json(validateLoginData?.errors);
    }
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // Decrypt password and compare with stored hash
    const isPasswordMatch = await bycrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      const errors = {};
      for (const field in err.errors) {
        errors[field] = err?.errors[field]?.message;
      }
      return res.status(400).json(errors);
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Find user by email
app.get("/users", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).send("Email is required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

//Update user by ID
app.patch("/users/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const data = req.body;
    const allowedUpdates = ["name", "password"];
    const isUpdateAllowed = Object.keys(data).every((update) =>
      allowedUpdates.includes(update),
    );
    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid updates");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      returnDocument: "after",
    });
    if (!updatedUser) {
      return res.status(404).send("User not found");
    }
    console.log("Request body:", req.body);
    console.log("Updated user:", updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Insert vehicle data into the database
app.post("/vehicle", async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, capacity, status, driverId } = req.body;
    console.log("Request body:", req.body);
    const vehicle = new Vehicle({
      vehicleNumber,
      vehicleType,
      capacity,
      status,
      driverId,
    });
    await vehicle.save();
    res.status(201).send("Vehicle created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Get all vehicles
app.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    if (!vehicles || vehicles.length === 0) {
      return res.status(404).send("No vehicles found");
    }
    res.status(200).json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
