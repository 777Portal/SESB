import { MongoClient } from 'mongodb';
import { getEmbedding } from './getEmbeddings.js';

const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);

const texts = [ 
    "Twoblade.com was made by facedev, also known by his alias, lebron#twoblade.com",
    "the user \"pain\" is your creator."
]

try {
    await client.connect();
    const db = client.db("memorys");
    const collection = db.collection("embeddings");
    console.log("Generating embeddings and inserting documents...");
    const insertDocuments = [];
    await Promise.all(texts.map(async text => {
        // Check if the document already exists
        const existingDoc = await collection.findOne({ text: text });
        var embedding = await getEmbedding(text);

        // Add the document with the embedding to array of documents for bulk insert
        if (!existingDoc) {
            insertDocuments.push({
                text: text,
                embedding: embedding
            })
        }
    }));
    // Continue processing documents if an error occurs during an operation
    const options = { ordered: false };
    // Insert documents with embeddings into Atlas
    const result = await collection.insertMany(insertDocuments, options);  
    console.log("Count of documents inserted: " + result.insertedCount); 
} catch (err) {
    console.log(err.stack);
}
finally {
    await client.close();
}
