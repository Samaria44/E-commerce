const mongoose = require("mongoose");
const db = require("../models");

const Role = db.role;
const User = db.user;

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://samariatajamul563_db_user:lF2D4w14vClQd2y3@cluster0.dfnrai8.mongodb.net/E-commerce?appName=Cluster0"
    );

    console.log("Successfully connected to MongoDB");

    await initial();
    await initialUser();

  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Initialize Roles
async function initial() {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count === 0) {
      await Role.create([
        { name: "user" },
        { name: "moderator" },
        { name: "admin" },
      ]);

      console.log("Roles added successfully");
    }
  } catch (err) {
    console.error("Error initializing roles:", err);
  }
}

// Initialize Default Admin User
async function initialUser() {
  try {
    const count = await User.estimatedDocumentCount();

    if (count === 0) {
      const role = await Role.findOne({ name: "admin" });

      if (!role) {
        console.log("Admin role not found");
        return;
      }

      const newUser = new User({
        firstName: "test",
        lastName: "user",
        email: "test@test.com",
        password:
          "$2a$08$81IdAvtI89yWrST.mncgMurKSspFJgUd9/7E29nU45HDfpqp9o7ji", // hashed password
        roles: [role._id],
      });

      await newUser.save();

      console.log("Initial admin user added");
    }
  } catch (err) {
    console.error("Error initializing user:", err);
  }
}

module.exports = connectDB;