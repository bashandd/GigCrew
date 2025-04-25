'use client';

import type { Job } from '@/services/job-board';
import { getJob } from '@/services/job-board';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, MapPin, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getJob(jobId);
        if (result) {
          setJob(result);
        } else {
          setError('Job not found.');
        }
      } catch (err) {
        setError('Failed to fetch job details. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [jobId]);

   // Placeholder for apply functionality
  const handleApply = async () => {
    setIsApplying(true);
    // TODO: Implement actual API call for applying
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Application Submitted!",
        description: `Successfully applied for ${job?.title}.`,
        variant: "default", // Use 'default' which corresponds to success styling
        action: (
            <Button variant="outline" size="sm" asChild>
                <Link href="/applications">View Applications</Link>
            </Button>
        ),
      });
      // Optionally redirect or update UI state
    } catch (err) {
       toast({
        title: "Application Failed",
        description: "Could not submit application. Please try again.",
        variant: "destructive",
      });
      console.error("Apply error:", err);
    } finally {
       setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Skeleton className="h-8 w-1/4 mb-4" />
        <Card>
          <CardHeader>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-28" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-6" />

            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-destructive">{error}</p>
         <Button variant="outline" asChild className="mt-4">
            <Link href="/jobs">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
            </Link>
        </Button>
      </div>
    );
  }

  if (!job) {
     return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground">Job details could not be loaded.</p>
         <Button variant="outline" asChild className="mt-4">
            <Link href="/jobs">
                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
            </Link>
        </Button>
      </div>
     );
  }


  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
         <Button variant="outline" size="sm" asChild className="mb-4">
            <Link href="/jobs">
                 <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
            </Link>
        </Button>
      <Card className="shadow-lg border border-border">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">{job.title}</CardTitle>
          <CardDescription className="text-lg">{job.company}</CardDescription>
           <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground pt-2">
            <span className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4" /> Full-time {/* Placeholder */}
            </span>
             <span className="flex items-center gap-1.5">
               <MapPin className="h-4 w-4" /> {job.location}
             </span>
             <span className="flex items-center gap-1.5">
               <DollarSign className="h-4 w-4" /> {job.salary}
             </span>
           </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-xl font-semibold mb-3">Job Description</h3>
          <p className="text-foreground/90 whitespace-pre-wrap">{job.description}</p>

          {/* Add sections for Requirements, Responsibilities, Benefits etc. if available */}
          {/* Example:
           <h3 className="text-xl font-semibold mt-6 mb-3">Requirements</h3>
           <ul className="list-disc list-inside space-y-1 text-foreground/90">
             <li>Requirement 1</li>
             <li>Requirement 2</li>
           </ul>
          */}

        </CardContent>
        <CardFooter>
          <Button
            onClick={handleApply}
            disabled={isApplying}
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isApplying ? 'Applying...' : 'Apply Now'}
            {!isApplying && <CheckCircle className="ml-2 h-5 w-5" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
