import { connect } from "mongoose";
import { config } from "dotenv";

config();

export const connectDB = async () => {
    try {
        connect(process.env.MONGO_URI as string);
        console.log("Connection to the Database was successful.");
    } catch (error) {
        console.log(error);
    }
}