'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Clock, CheckCircle, XCircle, Hourglass } from 'lucide-react';
import Link from 'next/link';

// Mock data structure for job applications
interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  dateApplied: string; // ISO string or Date object
  status: 'Applied' | 'Under Review' | 'Interviewing' | 'Offered' | 'Rejected' | 'Withdrawn';
}

// Mock function to fetch applications (replace with actual API call)
async function fetchApplications(): Promise<Application[]> {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return [
    { id: 'app1', jobId: '1', jobTitle: 'Software Engineer', company: 'Tech Corp', dateApplied: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Under Review' },
    { id: 'app2', jobId: '2', jobTitle: 'Data Scientist', company: 'Data Solutions', dateApplied: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Interviewing' },
    { id: 'app3', jobId: '4', jobTitle: 'Product Manager', company: 'Innovate LLC', dateApplied: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Applied' },
    { id: 'app4', jobId: '5', jobTitle: 'UX Designer', company: 'Creative Minds', dateApplied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Rejected' },
  ];
}

// Helper to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Helper to get status badge variant and icon
const getStatusStyle = (status: Application['status']) => {
  switch (status) {
    case 'Applied':
      return { variant: 'outline', icon: <Hourglass className="h-4 w-4 mr-1" />, colorClass: 'text-blue-600 border-blue-600' };
    case 'Under Review':
      return { variant: 'secondary', icon: <Clock className="h-4 w-4 mr-1" />, colorClass: 'text-yellow-600 bg-yellow-100 border-yellow-300' };
    case 'Interviewing':
      return { variant: 'default', icon: <Briefcase className="h-4 w-4 mr-1" />, colorClass: 'bg-primary/10 text-primary border-primary/30' };
    case 'Offered':
      return { variant: 'default', icon: <CheckCircle className="h-4 w-4 mr-1" />, colorClass: 'bg-green-100 text-green-700 border-green-300' };
    case 'Rejected':
      return { variant: 'destructive', icon: <XCircle className="h-4 w-4 mr-1" />, colorClass: 'bg-red-100 text-destructive border-destructive/30' };
     case 'Withdrawn':
        return { variant: 'outline', icon: <XCircle className="h-4 w-4 mr-1" />, colorClass: 'text-muted-foreground' };
    default:
      return { variant: 'outline', icon: <Hourglass className="h-4 w-4 mr-1" />, colorClass: 'text-muted-foreground' };
  }
};


export default function ApplicationTrackingPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to load applications. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadApplications();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Job Applications</h1>

      <Card className="shadow-md border border-border">
        <CardHeader>
          <CardTitle>Track Your Progress</CardTitle>
          <CardDescription>View the status of all jobs you have applied for.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Job Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Date Applied</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                   {[...Array(3)].map((_, i) => (
                     <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-28 rounded-full" /></TableCell>
                     </TableRow>
                   ))}
                </TableBody>
             </Table>
          ) : error ? (
            <p className="text-destructive text-center">{error}</p>
          ) : applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">You haven't applied for any jobs yet. <Link href="/jobs" className="text-primary hover:underline">Find jobs now!</Link></p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => {
                    const statusStyle = getStatusStyle(app.status);
                    return (
                        <TableRow key={app.id}>
                        <TableCell className="font-medium">
                            <Link href={`/jobs/${app.jobId}`} className="hover:underline text-primary">
                                {app.jobTitle}
                            </Link>
                        </TableCell>
                        <TableCell>{app.company}</TableCell>
                        <TableCell>{formatDate(app.dateApplied)}</TableCell>
                        <TableCell>
                            <Badge variant={statusStyle.variant} className={`capitalize ${statusStyle.colorClass}`}>
                            {statusStyle.icon}
                            {app.status}
                            </Badge>
                        </TableCell>
                        </TableRow>
                    );
                 })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
