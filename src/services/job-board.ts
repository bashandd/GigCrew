
import type { Job } from '@/types/job'; // Import shared Job type
import { getCollection, stringToObjectId } from '@/lib/mongodb';
import type { Collection, Filter, FindOptions, ObjectId } from 'mongodb';

const JOBS_COLLECTION = 'jobs';

/**
 * Gets the jobs collection from MongoDB.
 * @returns A promise that resolves to the jobs Collection instance.
 */
async function getJobsCollection(): Promise<Collection<Job>> {
  return getCollection<Job>(JOBS_COLLECTION);
}

/**
 * Serializes a job document by converting ObjectId to string and removing it if necessary.
 * @param job The job document from MongoDB.
 * @returns A serialized job object suitable for client-side use.
 */
 function serializeJob(job: Job): Job & { id: string } {
     // Convert ObjectId to string and assign to 'id'
     const serialized = {
         ...job,
         id: job._id!.toString(),
     };
     // Optionally remove the original _id if you don't want it on the client
     // delete serialized._id;
     return serialized;
 }


/**
 * Asynchronously retrieves job postings based on search criteria from MongoDB.
 *
 * @param searchTerm The search term to filter job postings (keywords, title, company).
 * @param location The location to filter job postings.
 * @param jobType The type of job to filter by.
 * @param experienceLevel The experience level to filter by.
 * @returns A promise that resolves to an array of serialized Job objects.
 */
export async function searchJobs(
    searchTerm: string,
    location: string,
    jobType?: string,
    experienceLevel?: string
): Promise<(Job & { id: string })[]> {
    console.log(`Searching jobs with term: ${searchTerm}, location: ${location}, type: ${jobType}, experience: ${experienceLevel}`);
    try {
        const jobsCollection = await getJobsCollection();
        const query: Filter<Job> = {};
        const options: FindOptions<Job> = {
            sort: { datePosted: -1 } // Sort by newest first
        };

        if (searchTerm) {
            // Case-insensitive search on title, company, and description
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' } },
                { company: { $regex: searchTerm, $options: 'i' } },
                { description: { $regex: searchTerm, $options: 'i' } },
            ];
        }

        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        if (jobType) {
            query.jobType = jobType as Job['jobType'];
        }

        if (experienceLevel) {
            query.experienceLevel = experienceLevel as Job['experienceLevel'];
        }

        const jobsCursor = jobsCollection.find(query, options);
        const jobsArray = await jobsCursor.toArray();

        // Serialize jobs before returning (convert _id to id string)
        return jobsArray.map(serializeJob);

    } catch (error) {
        console.error('Error searching jobs in MongoDB:', error);
        throw new Error('Failed to search jobs.'); // Re-throw or handle as appropriate
    }
}

/**
 * Asynchronously retrieves a job posting by its ID from MongoDB.
 *
 * @param jobId The string ID of the job posting to retrieve.
 * @returns A promise that resolves to a serialized Job object or null if not found or ID is invalid.
 */
export async function getJob(jobId: string): Promise<(Job & { id: string }) | null> {
    const objectId = stringToObjectId(jobId);
    if (!objectId) {
        console.warn(`Invalid Job ID format: ${jobId}`);
        return null; // Invalid ID format
    }

    try {
        const jobsCollection = await getJobsCollection();
        const job = await jobsCollection.findOne({ _id: objectId });

        if (!job) {
            return null; // Not found
        }

        // Serialize job before returning
        return serializeJob(job);
    } catch (error) {
        console.error(`Error fetching job with ID ${jobId} from MongoDB:`, error);
        throw new Error('Failed to fetch job details.');
    }
}

/**
 * Asynchronously posts a new job to MongoDB.
 *
 * @param jobData The job data to post (excluding the _id).
 * @returns A promise that resolves to the string ID of the newly inserted job.
 */
export async function postJob(jobData: Omit<Job, '_id' | 'id'>): Promise<string> {
    console.log('Attempting to post job:', jobData);
    try {
        const jobsCollection = await getJobsCollection();
        const jobToInsert: Omit<Job, '_id'> = {
            ...jobData,
            datePosted: new Date(), // Add posting date
        };

        const result = await jobsCollection.insertOne(jobToInsert);

        if (!result.insertedId) {
            throw new Error('Job insertion failed, no ID returned.');
        }

        console.log('Job posted with ID:', result.insertedId.toString());
        return result.insertedId.toString(); // Return the new string ID
    } catch (error) {
        console.error('Error posting job to MongoDB:', error);
        throw new Error('Failed to post job.');
    }
}
