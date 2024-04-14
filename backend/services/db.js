import { MongoClient, ServerApiVersion } from 'mongodb'

console.log('process.env.MONGODB_URI', process.env.MONGODB_URI)
const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false, // Must be false to use distinct
    deprecationErrors: true
  }
})
const db = client.db('skills')

export const skillsCollection = db.collection('skills')