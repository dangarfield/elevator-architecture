// import { MongoClient, ServerApiVersion } from 'mongodb'

// console.log('process.env.MONGODB_URI', process.env.MONGODB_URI) // TEMP DEBUG
// const client = new MongoClient(process.env.MONGODB_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: false,
//     deprecationErrors: true
//   }
// })

// const db = client.db('skills')
// const skillsCollection = db.collection('skills')

// import {skillsCollection} from '../services/db.js'

export default async (req, context) => {
  console.log('req', req.method)

  try {
    console.log('client')
    console.log('db')
    console.log('skillsCollection')

    if (req.method === 'GET') {
      console.log('get skills')
      let all = await skillsCollection.find().toArray()
      console.log('findRes')
      console.log('toArray', all)
      if (all.length === 0) all = [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0] }]
      all = all.map(s => s.data).reduce((acc, sublist) =>
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
    } else if (req.method === 'DELETE') {
      await skillsCollection.deleteMany()
      return Response.json({ message: 'complete' })
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
