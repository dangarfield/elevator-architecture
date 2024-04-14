import { MongoClient, ServerApiVersion } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true
  }
})

const db = client.db('abyssboard')
const skillsCollection = db.collection('skills')

export default async (req, context) => {
  console.log('req', req.method)

  try {
    console.log('client')
    console.log('db')
    console.log('skillsCollection')

    if (req.method === 'GET') {
      const all = await (await skillsCollection.find().toArray()).map(s => s.data).reduce((acc, sublist) =>
        acc.map((value, index) => value + sublist[index])
      )
      console.log('all', all)
      return Response.json(all)
    } else if (req.method === 'POST') {
      const body = await req.json()
      console.log('body', body)
      await skillsCollection.insertOne({ data: body })
      return Response.json({
        message: 'Hello POST'
      })
    } else {
      return Response.json({
        message: 'error'
      })
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  } finally {
    // if (cachedClient) {
    //   await cachedClient.close()
    //   cachedClient = null
    // }
  }
}
