import mongoose from "mongoose";

// db connection object to check if db is connected
type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

// db is in another continenent
// db-connection takes time
// db-connection can fail also

// void means I don't care about the type of return-type data
// very different than void in C++
async function dbConnect(): Promise<void> {
  // Check if we have a connection to the database or if it's currently connecting
  if (connection.isConnected) {
    console.log("Already Connected to the Database");
    return;
  }

  try {
    // Attempt to connect to db
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database Connection Failed", error);

    // Gracefully exit in case of a connection error
    process.exit(1);
  }
}

export default dbConnect;
