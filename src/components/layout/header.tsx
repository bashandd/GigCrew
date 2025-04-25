import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Briefcase, User, LogIn, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const navItems = [
    { href: '/', label: 'Home', icon: <Briefcase className="h-4 w-4 md:hidden" /> },
    { href: '/jobs', label: 'Find Jobs', icon: <Briefcase className="h-4 w-4 md:hidden" /> },
    { href: '/jobs/post', label: 'Post Job', icon: <PlusCircle className="h-4 w-4 md:hidden" /> },
    // Add profile/applications links when auth is implemented
    // { href: '/profile', label: 'Profile', icon: <User className="h-4 w-4 md:hidden" /> },
    // { href: '/applications', label: 'My Applications', icon: <User className="h-4 w-4 md:hidden" /> },
    // { href: '/employer/dashboard', label: 'Employer Dashboard', icon: <User className="h-4 w-4 md:hidden" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center mx-auto px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">CareerConnect</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-primary text-foreground/70"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-2 ml-auto">
           {/* Placeholder Login/Signup */}
           <Button variant="outline" size="sm" asChild>
            <Link href="/auth/login">
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Link>
           </Button>
           <Button size="sm" asChild>
            <Link href="/auth/signup">
              Sign Up
            </Link>
           </Button>


          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold mb-4"
                >
                  <Briefcase className="h-6 w-6 text-primary" />
                  <span>CareerConnect</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                 {/* Placeholder Login/Signup for mobile */}
                 <Link
                    href="/auth/login"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Link>
                   <Link
                    href="/auth/signup"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <User className="h-4 w-4" /> Sign Up
                  </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
