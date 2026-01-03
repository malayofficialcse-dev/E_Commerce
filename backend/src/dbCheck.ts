
import mongoose from 'mongoose';
import Order from './models/Order';
import dotenv from 'dotenv';
dotenv.config();

const check = async () => {
   await mongoose.connect(process.env.MONGODB_URI as string);
   const count = await Order.countDocuments();
   const latest = await Order.findOne().sort({ createdAt: -1 });
   console.log('--- DB CHECK ---');
   console.log('URI:', process.env.MONGODB_URI);
   console.log('Order Count:', count);
   console.log('Latest Order:', latest ? latest._id : 'NONE');
   console.log('Latest Amount:', latest ? latest.totalAmount : 'N/A');
   console.log('----------------');
   process.exit(0);
};
check();
