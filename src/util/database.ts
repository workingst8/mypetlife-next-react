import { MongoClient } from 'mongodb'
const url = 'mongodb+srv://workingst8:xm2T3sV8yn3j0p8g@cluster0.cjmrh6u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
let connectDB: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongo) {
    global._mongo = new MongoClient(url).connect()
  }
  connectDB = global._mongo
} else {
  connectDB = new MongoClient(url).connect()
}
export { connectDB }