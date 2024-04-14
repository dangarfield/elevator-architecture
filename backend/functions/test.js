
// const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";
const mongoClient = new MongoClient(process.env.MONGODB_URI)

const clientPromise = mongoClient.connect();

const handler = async (event) => {
    try {
        const database = (await clientPromise).db('skills');
        const collection = database.collection('skills');
        const one = await collection.findOne()
        return Response.json({one})
    } catch (error) {
        console.log('error', error)
        return new Response('Error')
        // return { statusCode: 500, body: error.toString() }
    }
}

export default handler
// module.exports = { handler }