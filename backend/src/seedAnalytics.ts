
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User";
import Product from "./models/Product";
import Order from "./models/Order";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("Connection Error:", error);
        process.exit(1);
    }
};

const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];

const getRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const seedData = async () => {
    await connectDB();

    try {
        // 1. Fetch Products
        const products = await Product.find({});
        if (products.length === 0) {
            console.log("No products found. Please create some products first.");
            process.exit(1);
        }

        // 2. Create Users
        console.log("Creating Users...");
        const users = [];
        for (let i = 0; i < 50; i++) {
            const firstName = getRandom(firstNames);
            const lastName = getRandom(lastNames);
            
            // Try to find if user exists to avoid duplicate key error on email
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 9999)}@example.com`;
            
            // Check if exists logic skipped for speed, assuming random enough or acceptable to fail few
            // Better: use create, ignore dupes or check.
            
            const user = new User({
                firstName,
                lastName,
                email,
                password: "password123", // fast hash not needed for mock, but assuming model doesn't auto hash or valid
                role: "customer",
                addresses: [{
                   street: `${getRandomInt(100, 999)} Main St`,
                   city: getRandom(cities),
                   state: "NY",
                   zipCode: "10001",
                   isDefault: true
                }]
            });
            users.push(user);
        }
        
        // Save users and catch duplicates without crashing everything
        const createdUsers = [];
        for (const u of users) {
           try {
              const savedUser = await u.save();
              createdUsers.push(savedUser);
           } catch (e) {
              // ignore duplicate emails
           }
        }
        console.log(`${createdUsers.length} Users Created.`);

        if (createdUsers.length === 0) {
           console.log("No new users created (maybe they existed). Using existing ones.");
           const existing = await User.find({ role: "customer" });
           createdUsers.push(...existing);
        }

        // 3. Create Orders (Past 12 Months)
        console.log("Creating Orders...");
        const orders = [];
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        for (let i = 0; i < 200; i++) {
            const user = getRandom(createdUsers);
            const product = getRandom(products);
            const variant = product.variants && product.variants.length > 0 ? getRandom(product.variants) : null;
            
            // Random Date
            const orderDate = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));
            
            // Random Status based on date
            // Older orders likely delivered
            let status = "placed";
            const ageInDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);
            
            if (ageInDays > 7) status = "delivered";
            else if (ageInDays > 2) status = "shipped";
            else status = "placed";

            // Occasional cancelled
            if (Math.random() > 0.95) status = "cancelled";

            const quantity = getRandomInt(1, 3);
            const price = variant ? variant.price : product.price;
            const total = price * quantity;

            const order = new Order({
                user: user._id,
                items: [{
                    product: product._id,
                    variantId: variant ? (variant._id || variant.sku) : "default",
                    quantity,
                    price,
                    name: product.title,
                    image: product.images?.[0] || ""
                }],
                totalAmount: total,
                shippingAddress: {
                    street: user.addresses[0]?.street || "123 Unknown St",
                    city: user.addresses[0]?.city || "New York",
                    state: "NY",
                    zipCode: "10001",
                    country: "USA",
                    phone: "1234567890"
                },
                paymentStatus: status === "cancelled" ? "failed" : "paid",
                orderStatus: status,
                paymentProvider: "stripe",
                estimatedDelivery: new Date(orderDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                createdAt: orderDate,
                updatedAt: orderDate
            });
            orders.push(order);
        }

        await Order.insertMany(orders);
        console.log(`${orders.length} Orders Created.`);
        console.log("Seeding Complete.");
        process.exit(0);

    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
