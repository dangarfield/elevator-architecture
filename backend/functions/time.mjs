import { MongoClient } from 'mongodb'

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

let db

const getConnection = async () => {
    if (db) return db
    const client = new MongoClient(process.env.MONGODB_URI)
    db = await client.connect()
    return db
}

const getSkillsCollection = async () => {
  const connection = await getConnection()
  const database = connection.db('skills')
  const collection = database.collection('times')
  return collection
}


export async function handler(req, context) {
  console.log('req', req)

  try {
    // console.log('client')
    // console.log('db')
    // console.log('skillsCollection')

    if (req.httpMethod === 'GET') {
      console.log('get skills')
      const skillsCollection = await getSkillsCollection()
      let all = await skillsCollection.find().toArray()
      console.log('findRes')
      console.log('toArray', all)
      if (all.length === 0) all = [{ data: [33,33, 33] }]
      all = all.map(s => s.data).reduce((acc, sublist) =>
        acc.map((value, index) => value + sublist[index])
      )
      const total = all.reduce(function (acc, obj) { return acc + obj }, 0) / 100
      
      const dividedArray = all.reduce((result, currentValue) => {
        result.push(Math.round(currentValue / total))
        return result
      }, [])

      console.log('all', total, all, dividedArray)

      // return Response.json(all)
      return {
            statusCode: 200,
            body: JSON.stringify(dividedArray)
        }
    } else if (req.httpMethod === 'POST') {
      const skillsCollection = await getSkillsCollection()
      const body = JSON.parse(req.body)
      console.log('body', body)
      await skillsCollection.insertOne({ data: body })
      // return Response.json({
      //   message: 'Hello POST'
      // })
      return {
            statusCode: 200,
            body: JSON.stringify({message: 'Hello POST'})
        }
    } else if (req.httpMethod === 'DELETE') {
      const skillsCollection = await getSkillsCollection()
      await skillsCollection.deleteMany()
      // return Response.json({ message: 'complete' })
      return {
            statusCode: 200,
            body: JSON.stringify({message: 'Complete'})
        }
    } else {
      // return Response.json({
      //   message: 'error'
      // })
      return {
            statusCode: 500,
            body: 'Error'
        }

    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
  // } finally {
  //       // Ensures that the client will close when you finish/error
  //       console.log('You are no longer connected to MongoDB')
  //       await client.close();
    }

}
