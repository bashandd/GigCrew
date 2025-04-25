import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <Image
        src="https://picsum.photos/seed/careerconnect/1200/400"
        alt="Hero image showing professionals connecting"
        width={1200}
        height={400}
        className="rounded-lg mb-8 w-full max-w-4xl object-cover h-64 shadow-md"
        priority
      />
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
        Find Your Dream Job or Candidate
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">
        CareerConnect is the platform where talent meets opportunity. Explore thousands of job postings or find the perfect candidate for your company.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-lg mb-12">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for jobs (e.g., 'Software Engineer')"
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <Link href="/jobs">Search Jobs</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-semibold mb-3">For Job Seekers</h2>
          <p className="text-muted-foreground mb-4">
            Create your profile, showcase your skills, and apply for jobs with ease. Track your application status in one place.
          </p>
          <Button variant="outline" asChild>
             {/* Link to profile creation/signup */}
            <Link href="/auth/signup?role=seeker">Get Started</Link>
          </Button>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-sm border border-border">
          <h2 className="text-2xl font-semibold mb-3">For Employers</h2>
          <p className="text-muted-foreground mb-4">
            Post job openings, manage applications efficiently, schedule interviews, and find the best talent for your team.
          </p>
          <Button variant="outline" asChild>
            <Link href="/auth/signup?role=employer">Post a Job</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
