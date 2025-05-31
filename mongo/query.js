import { MongoClient } from 'mongodb';
import { getEmbedding } from './getEmbeddings.js';

const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

export async function queryMemory(query) {
    try {
        await client.connect();

        const db = client.db("memorys");
        const collection = db.collection("embeddings");    

        const queryEmbedding = await getEmbedding(query);

        // Define the sample vector search pipeline
        const pipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbedding,
                    path: "embedding",
                    exact: true,
                    limit: 5
                }
            },
            {
                $project: {
                    _id: 0,
                    text: 1
                }
            }
        ];

        const cursor = collection.aggregate(pipeline);
        const results = await cursor.toArray();
        return results;
        
        } finally {
        await client.close();
    }
}