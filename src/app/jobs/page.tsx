'use client';

import type { Job } from '@/services/job-board';
import { searchJobs } from '@/services/job-board';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin, Filter } from 'lucide-react';
import Link from 'next/link';

export default function JobSearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Add filtering logic to searchJobs when backend is implemented
      const results = await searchJobs(searchTerm, location);
      // Simulate filtering on the client-side for now
      let filteredResults = results;
      if (jobType) {
        // Example filter - replace with actual API filtering
        filteredResults = filteredResults.filter(job => job.title.toLowerCase().includes(jobType.toLowerCase()));
      }
       if (experienceLevel) {
         // Example filter - replace with actual API filtering
         // Assuming job description contains experience level info
         filteredResults = filteredResults.filter(job => job.description.toLowerCase().includes(experienceLevel.toLowerCase()));
       }

      setJobs(filteredResults);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch on initial load

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Find Your Next Opportunity</h1>

      {/* Search and Filter Form */}
      <form onSubmit={handleSearch} className="mb-8 p-6 bg-card rounded-lg shadow border border-border">
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
          <Button type="submit" className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" /> Search Jobs
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 items-end">
           <div>
             <Label htmlFor="job-type">Job Type</Label>
             <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger id="job-type">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div>
             <Label htmlFor="experience-level">Experience Level</Label>
             <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger id="experience-level">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="">All Levels</SelectItem>
                 <SelectItem value="entry">Entry Level</SelectItem>
                 <SelectItem value="mid">Mid Level</SelectItem>
                 <SelectItem value="senior">Senior Level</SelectItem>
                 <SelectItem value="manager">Manager</SelectItem>
               </SelectContent>
             </Select>
           </div>
            {/* Add more filters as needed */}
            <div className="md:col-start-4 flex justify-end">
                 <Button type="button" variant="outline" onClick={fetchJobs}>
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
                  <CardDescription>{job.company} - {job.location}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{job.description}</p>
                  <p className="text-sm font-medium mt-2">{job.salary}</p>
                </CardContent>
                <CardFooter>
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
