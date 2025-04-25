'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Users, FileText, Eye, PlusCircle, Calendar, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

// Mock data structures
interface PostedJob {
  id: string;
  title: string;
  applicationsCount: number;
  status: 'Open' | 'Closed';
  datePosted: string;
}

interface Applicant {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  dateApplied: string;
  status: 'New' | 'Reviewed' | 'Interview Scheduled' | 'Rejected' | 'Hired';
}

// Mock fetch functions
async function fetchEmployerData(): Promise<{ jobs: PostedJob[], applicants: Applicant[] }> {
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate delay
  return {
    jobs: [
      { id: 'job1', title: 'Senior Frontend Engineer', applicationsCount: 15, status: 'Open', datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'job2', title: 'Marketing Manager', applicationsCount: 28, status: 'Open', datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'job3', title: 'Junior Backend Developer', applicationsCount: 5, status: 'Closed', datePosted: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    applicants: [
      { id: 'app1', jobId: 'job1', jobTitle: 'Senior Frontend Engineer', name: 'Alice Johnson', dateApplied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'New' },
      { id: 'app2', jobId: 'job1', jobTitle: 'Senior Frontend Engineer', name: 'Bob Smith', dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Reviewed' },
      { id: 'app3', jobId: 'job2', jobTitle: 'Marketing Manager', name: 'Charlie Brown', dateApplied: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Interview Scheduled' },
      { id: 'app4', jobId: 'job2', jobTitle: 'Marketing Manager', name: 'Diana Prince', dateApplied: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), status: 'New' },
    ],
  };
}

// Mock update function
async function updateApplicantStatus(applicantId: string, newStatus: Applicant['status']): Promise<void> {
     console.log(`Updating applicant ${applicantId} to status ${newStatus}`);
     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
     // In a real app, you'd likely refetch or update the state here
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState<PostedJob[]>([]);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchData = async () => {
     setIsLoading(true);
     setError(null);
     try {
        const data = await fetchEmployerData();
        setJobs(data.jobs);
        setApplicants(data.applicants);
     } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
        console.error(err);
     } finally {
        setIsLoading(false);
     }
   };

  useEffect(() => {
    fetchData();
  }, []);


   const handleStatusChange = async (applicantId: string, newStatus: Applicant['status']) => {
     try {
       await updateApplicantStatus(applicantId, newStatus);
       // Optimistically update UI or refetch data
       setApplicants(prev =>
         prev.map(app => app.id === applicantId ? { ...app, status: newStatus } : app)
       );
       toast({
         title: "Status Updated",
         description: `Applicant status changed to ${newStatus}.`,
       });
     } catch (err) {
       toast({
         title: "Update Failed",
         description: "Could not update applicant status.",
         variant: "destructive",
       });
       console.error("Status update error:", err);
     }
   };


  const totalOpenJobs = jobs.filter(job => job.status === 'Open').length;
  const totalApplications = applicants.length; // Or calculate based on job counts if needed


  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Employer Dashboard</h1>
        <Button asChild>
          <Link href="/jobs/post">
            <PlusCircle className="mr-2 h-4 w-4" /> Post New Job
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalOpenJobs}</div> }
            <p className="text-xs text-muted-foreground">Currently active job postings</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications Received</CardTitle>
             <Users className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{totalApplications}</div> }
             <p className="text-xs text-muted-foreground">Across all open positions</p>
           </CardContent>
         </Card>
          <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
             <FileText className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
              {isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{applicants.filter(a => a.status === 'New').length}</div> }
              <p className="text-xs text-muted-foreground">New applications awaiting review</p>
           </CardContent>
         </Card>
      </div>

      {/* Recent Job Postings Table */}
       <Card>
        <CardHeader>
          <CardTitle>My Job Postings</CardTitle>
           <CardDescription>Manage your active and past job postings.</CardDescription>
         </CardHeader>
         <CardContent>
           {isLoading ? (
               <div className="space-y-2">
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
               </div>
           ) : error ? (
             <p className="text-destructive text-center">{error}</p>
           ) : jobs.length === 0 ? (
             <p className="text-center text-muted-foreground py-6">You haven't posted any jobs yet.</p>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Title</TableHead>
                   <TableHead>Applications</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Date Posted</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {jobs.map((job) => (
                   <TableRow key={job.id}>
                     <TableCell className="font-medium">{job.title}</TableCell>
                     <TableCell>{job.applicationsCount}</TableCell>
                     <TableCell>
                        <Badge variant={job.status === 'Open' ? 'default' : 'outline'}
                               className={job.status === 'Open' ? 'bg-green-100 text-green-700 border-green-300' : ''}>
                            {job.status}
                        </Badge>
                     </TableCell>
                     <TableCell>{formatDate(job.datePosted)}</TableCell>
                     <TableCell>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/employer/jobs/${job.id}/applicants`}>
                                <Eye className="mr-1 h-4 w-4" /> View Applicants
                            </Link>
                        </Button>
                        {/* Add Edit/Close actions */}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           )}
         </CardContent>
       </Card>


      {/* Recent Applications Table */}
       <Card>
         <CardHeader>
           <CardTitle>Recent Applications</CardTitle>
           <CardDescription>Review and manage recent applications for your open positions.</CardDescription>
         </CardHeader>
         <CardContent>
            {isLoading ? (
               <div className="space-y-2">
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
                 <Skeleton className="h-8 w-full" />
               </div>
            ) : error ? (
             <p className="text-destructive text-center">{error}</p>
            ) : applicants.length === 0 ? (
             <p className="text-center text-muted-foreground py-6">No applications received yet.</p>
            ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Applicant Name</TableHead>
                   <TableHead>Applied For</TableHead>
                   <TableHead>Date Applied</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {applicants.map((applicant) => (
                   <TableRow key={applicant.id}>
                     <TableCell className="font-medium">
                         {/* Link to applicant profile page */}
                         <Link href={`/employer/applicants/${applicant.id}`} className="hover:underline text-primary">
                            {applicant.name}
                         </Link>
                     </TableCell>
                     <TableCell>{applicant.jobTitle}</TableCell>
                     <TableCell>{formatDate(applicant.dateApplied)}</TableCell>
                     <TableCell>
                        <Select
                             value={applicant.status}
                             onValueChange={(newStatus) => handleStatusChange(applicant.id, newStatus as Applicant['status'])}
                           >
                             <SelectTrigger className="h-8 w-[180px] text-xs">
                               <SelectValue placeholder="Change Status" />
                             </SelectTrigger>
                             <SelectContent>
                               <SelectItem value="New">New</SelectItem>
                               <SelectItem value="Reviewed">Reviewed</SelectItem>
                               <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
                               <SelectItem value="Rejected">Rejected</SelectItem>
                               <SelectItem value="Hired">Hired</SelectItem>
                             </SelectContent>
                           </Select>
                     </TableCell>
                     <TableCell className="space-x-1">
                         <Button variant="ghost" size="icon" asChild title="View Application">
                             <Link href={`/employer/applicants/${applicant.id}`}>
                                 <Eye className="h-4 w-4" />
                             </Link>
                         </Button>
                         <AlertDialog>
                             <AlertDialogTrigger asChild>
                                 <Button variant="ghost" size="icon" title="Schedule Interview">
                                     <Calendar className="h-4 w-4" />
                                 </Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                                 <AlertDialogHeader>
                                     <AlertDialogTitle>Schedule Interview?</AlertDialogTitle>
                                     <AlertDialogDescription>
                                         This will update the applicant's status to 'Interview Scheduled'. Add integration with a calendar service later.
                                     </AlertDialogDescription>
                                 </AlertDialogHeader>
                                 <AlertDialogFooter>
                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
                                     <AlertDialogAction onClick={() => handleStatusChange(applicant.id, 'Interview Scheduled')}>
                                         Confirm Schedule
                                     </AlertDialogAction>
                                 </AlertDialogFooter>
                             </AlertDialogContent>
                         </AlertDialog>
                         {/* Add Reject/Hire Quick Actions if needed */}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           )}
         </CardContent>
       </Card>
    </div>
  );
}
