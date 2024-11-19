import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);        
        return conn;
    } catch (error) {
        console.log(error);
    }
};

export default dbConnect;