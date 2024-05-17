import mongoose from "mongoose";


export const mongodbConnect = async () => {
    const connectionString = process.env.MONGODB_CONNECTION_STRING as string;
    try {
        const connect = await mongoose.connect(connectionString);
        console.log(`🌿 mongodb connected to ${connect.connection.host} ${connect.connection.name}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

