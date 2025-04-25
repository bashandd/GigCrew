/**
 * Represents a job posting.
 */
export interface Job {
  /**
   * The unique identifier for the job.
   */
  id: string;
  /**
   * The title of the job.
   */
  title: string;
  /**
   * The description of the job.
   */
  description: string;
  /**
   * The company posting the job.
   */
  company: string;
  /**
   * The location of the job.
   */
  location: string;
  /**
   * The salary range for the job.
   */
  salary: string;
   /**
   * The type of job (e.g., full-time, part-time). Optional.
   */
   jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
   /**
    * The required experience level. Optional.
    */
   experienceLevel?: 'entry' | 'mid' | 'senior' | 'manager';
}

// Mock job data including new fields
const mockJobs: Job[] = [
   {
    id: '1',
    title: 'Software Engineer',
    description: 'Develop and maintain software applications. Seeking mid-level engineer with 3+ years experience.',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    jobType: 'full-time',
    experienceLevel: 'mid',
  },
  {
    id: '2',
    title: 'Data Scientist',
    description: 'Analyze data to identify trends and insights. Senior level position requiring 5+ years experience.',
    company: 'Data Solutions',
    location: 'New York, NY',
    salary: '$140,000 - $180,000',
    jobType: 'full-time',
    experienceLevel: 'senior',
  },
   {
     id: '3',
     title: 'Marketing Intern',
     description: 'Assist the marketing team with campaigns and social media. Great opportunity for entry-level candidates.',
     company: 'Innovate LLC',
     location: 'Remote',
     salary: '$20 - $25 / hour',
     jobType: 'internship',
     experienceLevel: 'entry',
   },
    {
     id: '4',
     title: 'Part-time Graphic Designer',
     description: 'Create visual assets for web and print. Contract position, 15-20 hours/week.',
     company: 'Creative Minds',
     location: 'Austin, TX',
     salary: '$40 - $50 / hour',
     jobType: 'contract',
     experienceLevel: 'mid',
   },
];


/**
 * Asynchronously retrieves job postings based on search criteria.
 * NOTE: Filtering is simulated on the client side in the current implementation.
 * Backend should handle actual filtering.
 *
 * @param searchTerm The search term to filter job postings (keywords, title, company).
 * @param location The location to filter job postings.
 * @param jobType The type of job to filter by.
 * @param experienceLevel The experience level to filter by.
 * @returns A promise that resolves to an array of Job objects.
 */
export async function searchJobs(
    searchTerm: string,
    location: string,
    jobType?: string,
    experienceLevel?: string
    ): Promise<Job[]> {
  // TODO: Implement actual API call with filtering parameters.
  console.log(`Searching jobs with term: ${searchTerm}, location: ${location}, type: ${jobType}, experience: ${experienceLevel}`);
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  // Simulate filtering based on searchTerm and location for now
  const lowerSearchTerm = searchTerm.toLowerCase();
  const lowerLocation = location.toLowerCase();

  const results = mockJobs.filter(job => {
      const termMatch = !searchTerm ||
          job.title.toLowerCase().includes(lowerSearchTerm) ||
          job.company.toLowerCase().includes(lowerSearchTerm) ||
          job.description.toLowerCase().includes(lowerSearchTerm);

      const locationMatch = !location ||
          job.location.toLowerCase().includes(lowerLocation);

      // Note: jobType and experienceLevel filtering should ideally happen server-side
      // but are handled in the calling component for this mock setup.

      return termMatch && locationMatch;
  });

  return results;
}

/**
 * Asynchronously retrieves a job posting by its ID.
 *
 * @param jobId The ID of the job posting to retrieve.
 * @returns A promise that resolves to a Job object or undefined if not found.
 */
export async function getJob(jobId: string): Promise<Job | undefined> {
  // TODO: Implement actual API call.
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  const job = mockJobs.find(j => j.id === jobId);

   // Handle simulated job IDs created by postJob mock
   if (!job && jobId.startsWith('simulated-')) {
       return {
        id: jobId,
        title: 'Simulated Job Posting',
        description: 'This is a placeholder description for a job created via the mock "Post Job" form.',
        company: 'Simulated Company Inc.',
        location: 'Virtual Location',
        salary: '$80,000 - $100,000',
        jobType: 'full-time',
        experienceLevel: 'mid'
       };
   }

  return job;
}

/**
 * Asynchronously posts a new job.
 *
 * @param jobData The job data to post (excluding the ID).
 * @returns A promise that resolves to the ID of the new job.
 */
export async function postJob(jobData: Omit<Job, 'id'>): Promise<string> {
  // TODO: Implement actual API call to create the job and return its real ID.
  console.log('Posting job:', jobData);
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

  // Simulate creating a new job and assigning an ID
  const newJobId = `simulated-${Date.now()}`; // Create a pseudo-unique ID for mock
  const newJob: Job = {
      ...jobData,
      id: newJobId,
  };
  mockJobs.push(newJob); // Add to our mock data store (won't persist)

  console.log('Job posted with simulated ID:', newJobId);
  return newJobId;
}
