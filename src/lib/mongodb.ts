
import { MongoClient, Db, Collection, Document, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}
if (!dbName) {
    throw new Error('Please define the MONGODB_DB_NAME environment variable inside .env');
}

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

/**
 * Connects to the MongoDB database and returns the MongoClient instance.
 * Handles caching the connection promise.
 * @returns A promise that resolves to the MongoClient instance.
 */
async function connectToDatabase(): Promise<MongoClient> {
    if (process.env.NODE_ENV === 'development') {
        // In development mode, use a global variable so that the value
        // is preserved across module reloads caused by HMR (Hot Module Replacement).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let globalWithMongo = global as typeof globalThis & {
            _mongoClientPromise?: Promise<MongoClient>;
        };

        if (!globalWithMongo._mongoClientPromise) {
            client = new MongoClient(uri!);
            globalWithMongo._mongoClientPromise = client.connect();
        }
        clientPromise = globalWithMongo._mongoClientPromise;
    } else {
        // In production mode, it's best to not use a global variable.
        if (!clientPromise) {
            client = new MongoClient(uri!);
            clientPromise = client.connect();
        }
    }
    return clientPromise!;
}

/**
 * Gets the MongoDB database instance.
 * @returns A promise that resolves to the Db instance.
 */
export async function getDb(): Promise<Db> {
    const mongoClient = await connectToDatabase();
    return mongoClient.db(dbName);
}

/**
 * Gets a specific collection from the database.
 * @param collectionName The name of the collection.
 * @returns A promise that resolves to the Collection instance.
 */
export async function getCollection<T extends Document>(collectionName: string): Promise<Collection<T>> {
    const db = await getDb();
    return db.collection<T>(collectionName);
}

/**
 * Converts a string ID to a MongoDB ObjectId.
 * Returns null if the ID is invalid.
 * @param id The string ID to convert.
 * @returns A MongoDB ObjectId or null.
 */
export function stringToObjectId(id: string): ObjectId | null {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}
