import { log } from "console";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if(!uri){
    throw new Error('Please define the MONGODB_URI environment variable');
}

let client;

export async function connectToDB() {
  client = new MongoClient(uri);
  await client.connect();
  log("Connected to MongoDB");
  return { client };
}