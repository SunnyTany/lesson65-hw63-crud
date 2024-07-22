import { MongoClient } from 'mongodb'

export async function connectDB() {
  const client = new MongoClient(process.env.MONGODB_URI)
  const dbName = process.env.DB_NAME

  try {
    await client.connect()
    console.log('Connected to Database')
    return client.db(dbName)
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error
  }
}
