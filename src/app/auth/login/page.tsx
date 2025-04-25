'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

   // Placeholder login function
   const handleLogin = async (data: LoginFormData) => {
     setIsSubmitting(true);
     console.log("Login attempt with:", data);
     // TODO: Implement actual authentication API call
     try {
       // Simulate API call
       await new Promise(resolve => setTimeout(resolve, 1500));
       // Assume login is successful for now
       toast({
         title: 'Login Successful!',
         description: 'Welcome back!',
       });
       // Redirect to dashboard or homepage
       // Check user role after successful login to redirect appropriately
       // e.g., if (user.role === 'employer') router.push('/employer/dashboard');
       // else router.push('/');
       router.push('/'); // Redirect to homepage for now
     } catch (error) {
       console.error('Login failed:', error);
       toast({
         title: 'Login Failed',
         description: 'Invalid email or password. Please try again.', // Generic error message
         variant: 'destructive',
       });
     } finally {
       setIsSubmitting(false);
     }
   };

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    handleLogin(data);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4">
      <Card className="w-full max-w-md shadow-lg border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
             <LogIn className="h-6 w-6 text-primary" /> Login to CareerConnect
          </CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                     <FormMessage />
                  </FormItem>
                )}
              />
               <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                 {isSubmitting ? 'Logging in...' : 'Login'}
               </Button>
            </form>
          </Form>
        </CardContent>
         <CardFooter className="flex flex-col items-center gap-2 pt-4">
            <Link href="/auth/forgot-password" // Placeholder link
                className="text-sm text-primary hover:underline">
                Forgot password?
            </Link>
             <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
               <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                 Sign Up
               </Link>
             </p>
         </CardFooter>
      </Card>
    </div>
  );
}
