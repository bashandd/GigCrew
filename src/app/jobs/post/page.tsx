'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { postJob } from '@/services/job-board';
import type { Job } from '@/services/job-board';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'; // Use App Router's router
import { PlusCircle } from 'lucide-react';

// Define Zod schema for form validation
const jobSchema = z.object({
  title: z.string().min(3, { message: 'Job title must be at least 3 characters long.' }),
  company: z.string().min(2, { message: 'Company name must be at least 2 characters long.' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters long.' }),
  salary: z.string().min(3, { message: 'Salary information is required.' }),
  description: z.string().min(50, { message: 'Description must be at least 50 characters long.' }),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship'], { required_error: "Job type is required." }),
  experienceLevel: z.enum(['entry', 'mid', 'senior', 'manager'], { required_error: "Experience level is required." }),
});

type JobFormData = z.infer<typeof jobSchema>;

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      company: '',
      location: '',
      salary: '',
      description: '',
      // Default values for selects can be set if needed
      // jobType: undefined,
      // experienceLevel: undefined,
    },
  });

  const onSubmit: SubmitHandler<JobFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Construct the Job object, id will be assigned by backend
      const newJob: Omit<Job, 'id'> & { jobType?: string; experienceLevel?: string } = {
        title: data.title,
        company: data.company,
        location: data.location,
        salary: data.salary,
        description: data.description,
        // Include optional fields if needed by backend
        // jobType: data.jobType,
        // experienceLevel: data.experienceLevel,
      };

      // TODO: Replace with actual postJob API call
      // const jobId = await postJob(newJob as Job); // Cast might be needed depending on Job interface
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      const simulatedJobId = 'simulated-' + Math.random().toString(36).substring(7);

      toast({
        title: 'Job Posted Successfully!',
        description: `The job "${data.title}" has been posted.`,
        variant: 'default',
      });
      // Redirect to the newly posted job or employer dashboard
      router.push(`/jobs/${simulatedJobId}`); // Redirect to a simulated job page for now
      // router.push('/employer/dashboard'); // Or redirect to employer dashboard
    } catch (error) {
      console.error('Failed to post job:', error);
      toast({
        title: 'Error Posting Job',
        description: 'Could not post the job. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Card className="shadow-md border border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <PlusCircle className="h-6 w-6 text-primary" /> Post a New Job
          </CardTitle>
          <CardDescription>Fill in the details below to post a job opening.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Engineer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tech Innovations Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., San Francisco, CA" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="jobType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         <SelectItem value="full-time">Full-time</SelectItem>
                         <SelectItem value="part-time">Part-time</SelectItem>
                         <SelectItem value="contract">Contract</SelectItem>
                         <SelectItem value="internship">Internship</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                control={form.control}
                name="experienceLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         <SelectItem value="entry">Entry Level</SelectItem>
                         <SelectItem value="mid">Mid Level</SelectItem>
                         <SelectItem value="senior">Senior Level</SelectItem>
                         <SelectItem value="manager">Manager</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary Range</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $100,000 - $120,000 per year" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Provide a detailed description of the job role, responsibilities, and requirements."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <CardFooter className="px-0 pt-6">
                 <Button type="submit" disabled={isSubmitting} size="lg">
                    {isSubmitting ? 'Posting Job...' : 'Post Job'}
                 </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
