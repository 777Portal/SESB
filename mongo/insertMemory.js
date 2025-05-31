import { MongoClient } from 'mongodb';
import { getEmbedding } from './getEmbeddings.js';

const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

export async function insertMemory(text){
    try {
        await client.connect();
        const db = client.db("memorys");
        const collection = db.collection("embeddings");
        console.log("Generating embeddings and inserting documents...");
        
        const existingDoc = await collection.findOne({ text: text });
        if (existingDoc) return console.warn('tried to insert memory that already existed: ' +  text);

        var embedding = await getEmbedding(text);
    
        if (!existingDoc) {
            await collection.insertOne({
                text: text,
                embedding: embedding
            });
        }
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

