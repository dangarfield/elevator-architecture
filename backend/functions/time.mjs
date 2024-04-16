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
const classifyArchitect = (internalPercentage, inwardsPercentage, outwardsPercentage) => {
    if (internalPercentage === 50 && inwardsPercentage === 25 && outwardsPercentage === 25) {
        return "Perfect"
    }
    else if (Math.abs(internalPercentage - 50) <= 5 && Math.abs(inwardsPercentage - 25) <= 5 && Math.abs(outwardsPercentage - 25) <= 5) {
        return "Almost Perfect"
    }
    else if (internalPercentage > 50 && inwardsPercentage > 25) {
        return "Goldplating"
    }
    else if (internalPercentage > 50) {
        return "Ivory Tower"
    }
    else if (internalPercentage < 50 && outwardsPercentage > 25) {
        return "Just Consultants"
    }
    else if (internalPercentage < 50) {
        return "Absent Architect"
    }
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
      if (all.length === 0) all = [{ data: [0,0, 0] }]
      const types = [0,0,0,0,0,0]
      all.forEach(res => {
        const type = classifyArchitect(...res.data)
        console.log('type', type, res.data)
        if(res.data[0] === 0 && res.data[1] === 0 && res.data[2] === 0 ) {
          // Nothing
        } else
        if (type === 'Perfect') types[0]++;
        else if (type === 'Almost Perfect') types[1]++
        else if (type === 'Goldplating') types[2]++
        else if (type === 'Ivory Tower') types[3]++
        else if (type === 'Just Consultants') types[4]++
        else if (type === 'Absent Architect') types[5]++
      })
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
            body: JSON.stringify({times:dividedArray, types: types})
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
