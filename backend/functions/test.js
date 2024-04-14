
const { MongoClient } = require("mongodb");
// import { MongoClient } from "mongodb";
// const mongoClient = new MongoClient(process.env.MONGODB_URI)
const mongoClient = new MongoClient('mongodb+srv://arch:arch@cluster0.bjaxcux.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')




const clientPromise = mongoClient.connect();

const handler  = async (event, context) => {
    try {
        const database = (await clientPromise).db('skills');
        const collection = database.collection('skills');
        const one = await collection.findOne()
        // return Response.json({one}, {statusCode:200})
        return { statusCode: 500, body: one.data.toString() }
    } catch (error) {
        console.log('error', error)
        // return new Response('Error')
        return { statusCode: 500, body: error.toString() }
    }
}

// export default handler
module.exports = { handler }

// export async function handler (event, context) {
//   return await app.run(event, context)
// }
