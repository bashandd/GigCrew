'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation'; // Use App Router hooks
import { UserPlus } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
  role: z.enum(['seeker', 'employer'], { required_error: "Please select your role." }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'employer' ? 'employer' : 'seeker';

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: initialRole,
    },
  });

   // Update role if URL parameter changes after initial load
   useEffect(() => {
    const roleFromUrl = searchParams.get('role') === 'employer' ? 'employer' : 'seeker';
    if (roleFromUrl !== form.getValues('role')) {
      form.setValue('role', roleFromUrl);
    }
  }, [searchParams, form]);

  // Placeholder signup function
  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    console.log("Signup attempt with:", data);
    // TODO: Implement actual user creation API call
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Assume signup is successful for now
      toast({
        title: 'Account Created Successfully!',
        description: 'Welcome to CareerConnect. Please log in.',
      });
      // Redirect to login page after successful signup
      router.push('/auth/login');
    } catch (error) {
      console.error('Signup failed:', error);
      // Handle specific errors like email already exists if possible
      toast({
        title: 'Signup Failed',
        description: 'Could not create account. Please try again.', // Generic error message
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit: SubmitHandler<SignupFormData> = (data) => {
    handleSignup(data);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-8 px-4">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
             <UserPlus className="h-6 w-6 text-primary" /> Create Your CareerConnect Account
          </CardTitle>
          <CardDescription>Join us as a job seeker or an employer.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>I am a...</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="seeker" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Job Seeker (Looking for jobs)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="employer" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Employer (Posting jobs)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Choose a strong password" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                 {isSubmitting ? 'Creating Account...' : 'Sign Up'}
               </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex justify-center pt-4">
             <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
               <Link href="/auth/login" className="text-primary hover:underline font-medium">
                 Log In
               </Link>
             </p>
         </CardFooter>
      </Card>
    </div>
  );
}
