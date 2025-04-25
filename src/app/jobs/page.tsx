
'use client';

import type { Job } from '@/types/job'; // Use shared Job type
import { searchJobs } from '@/services/job-board';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Filter, Briefcase } from 'lucide-react'; // Added Briefcase
import Link from 'next/link';

// Define the type for the serialized job with 'id'
type JobWithId = Job & { id: string };

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState(''); // Store value like "full-time"
  const [experienceLevel, setExperienceLevel] = useState(''); // Store value like "entry"
  const [jobs, setJobs] = useState<JobWithId[]>([]); // Use JobWithId type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use useCallback to memoize fetchJobs function
  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
        // Pass filters directly to the MongoDB service
        const results = await searchJobs(searchTerm, location, jobType, experienceLevel);
        setJobs(results); // Results are already serialized with 'id'
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error(err);
      setJobs([]); // Clear jobs on error
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, location, jobType, experienceLevel]); // Dependencies for useCallback


  useEffect(() => {
    fetchJobs(); // Fetch on initial load and when filters change
  }, [fetchJobs]); // fetchJobs is memoized, so this runs when its dependencies change

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs(); // Manually trigger fetch on form submit if needed (though it runs on filter change)
  };

   const handleFilterChange = () => {
     // No need to explicitly call fetchJobs here if useEffect handles it based on state changes
     // If you prefer explicit trigger on button click:
     // fetchJobs();
   };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Your Next Opportunity</h1>

      {/* Search and Filter Form */}
      <form onSubmit={handleSearchSubmit} className="mb-8 p-6 bg-card rounded-lg shadow border border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <Label htmlFor="search-term">Keywords</Label>
            <div className="relative">
               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
               <Input
                id="search-term"
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
             <div className="relative">
               <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="City, state, or zip code"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
           {/* "Search Jobs" button primarily for keyword/location search */}
          <Button type="submit" className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" /> Search Jobs
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
           <div>
             <Label htmlFor="job-type">Job Type</Label>
             <Select value={jobType} onValueChange={(value) => setJobType(value === "all" ? "" : value)}>
              <SelectTrigger id="job-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div>
             <Label htmlFor="experience-level">Experience Level</Label>
             <Select value={experienceLevel} onValueChange={(value) => setExperienceLevel(value === "all" ? "" : value)}>
              <SelectTrigger id="experience-level">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="all">All Levels</SelectItem>
                 <SelectItem value="entry">Entry Level</SelectItem>
                 <SelectItem value="mid">Mid Level</SelectItem>
                 <SelectItem value="senior">Senior Level</SelectItem>
                 <SelectItem value="manager">Manager</SelectItem>
               </SelectContent>
             </Select>
           </div>
            {/* Add more filters as needed */}
            <div className="md:col-start-4 flex justify-end">
                 {/* This button might become redundant if useEffect triggers fetch on filter changes */}
                 <Button type="button" variant="outline" onClick={handleFilterChange}>
                 <Filter className="mr-2 h-4 w-4" /> Apply Filters
                 </Button>
            </div>
        </div>

      </form>

      {/* Job Listings */}
      <div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive text-center">{error}</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground">No jobs found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <CardDescription>
                    {job.company} - {job.location}
                  </CardDescription>
                  {/* Optionally display Job Type / Experience */}
                   <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                      {job.jobType && (
                           <span className="flex items-center gap-1 capitalize">
                             <Briefcase className="h-3 w-3" /> {job.jobType.replace('-', ' ')}
                           </span>
                       )}
                       {job.experienceLevel && (
                           <span className="flex items-center gap-1 capitalize">
                              {/* Reuse icon or choose another */}
                              <Briefcase className="h-3 w-3" /> {job.experienceLevel} Level
                            </span>
                       )}
                    </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                  <p className="text-sm font-medium mt-2">{job.salary}</p>
                </CardContent>
                <CardFooter>
                  {/* Link uses the string 'id' provided by serialization */}
                  <Button asChild variant="default" size="sm">
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
