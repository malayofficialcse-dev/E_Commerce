
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce");
    console.log("Connected to MongoDB for seeding");

    const adminEmail = "maitymalay27747@gmail.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists. Updating role and password if needed...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);
      
      existingAdmin.password = hashedPassword;
      existingAdmin.firstName = "Malay";
      existingAdmin.lastName = "Maity";
      existingAdmin.role = "admin"; // Force admin role
      await existingAdmin.save();
      console.log("Admin user updated successfully.");
    } else {
      console.log("Creating new admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("123456", salt);

      const newUser = new User({
        firstName: "Malay",
        lastName: "Maity",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        addresses: [],
        wishlist: [],
      });

      await newUser.save();
      console.log("Admin user seeded successfully.");
    }

    mongoose.disconnect();
    console.log("Seeding complete. Disconnected.");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedAdmin();
