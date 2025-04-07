'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, ShieldAlert } from 'lucide-react';

export default function PendingApproval() {
  const [userName, setUserName] = useState('');
  const [status, setStatus] = useState('checking'); // checking, pending, or rejected
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  useEffect(() => {
    const checkApprovalStatus = async () => {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        // Not authenticated, redirect to login
        router.push('/admin/login');
        return;
      }
      
      const user = session.user;
      
      // Get user metadata
      setUserName(user.user_metadata?.name || user.email || '');
      
      // Check user's role
      const role = user.user_metadata?.role;
      
      if (role === 'admin' || role === 'super_admin') {
        // Already approved, redirect to dashboard
        router.push('/admin/dashboard');
        return;
      }
      
      if (role === 'pending') {
        // Still pending
        setStatus('pending');
      } else {
        // Request rejected or status unknown
        setStatus('rejected');
      }
    };
    
    checkApprovalStatus();
  }, [router, supabase]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };
  
  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#00adb5]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-[#00adb5]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        </div>
        
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl relative z-10">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00adb5]"></div>
          </div>
          <p className="text-center mt-4 text-gray-600">Checking your access status...</p>
        </div>
      </div>
    );
  }
  
  if (status === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#00adb5]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute -bottom-8 right-20 w-72 h-72 bg-[#00adb5]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        </div>
        
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl relative z-10">
          <div className="text-center mb-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <ShieldAlert className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Denied</h2>
            <p className="mt-2 text-gray-600">
              Your request for admin access was declined or your account status is invalid. Please contact the administrator for more information.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00adb5] hover:bg-[#00adb5]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00adb5] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-teal-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-[#00adb5]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-300/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        <div className="absolute -bottom-8 right-20 w-72 h-72 bg-[#00adb5]/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      </div>
      
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-xl relative z-10">
        <div className="flex flex-col items-center">
          <Image 
            src="https://admin.enitje.com/logo"
            alt="ENIT Junior Entreprise" 
            width={100} 
            height={100} 
            className="mx-auto"
            priority
          />
          <div className="text-center mt-6 mb-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Awaiting Approval</h2>
            <p className="mt-2 text-gray-600">
              Hello {userName}! Your request for admin access is pending review by an administrator. 
              You'll receive an email notification once your request is approved.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 p-4 rounded-md text-blue-800 text-sm mb-6 w-full">
            <p className="font-medium mb-1">What happens next?</p>
            <ul className="list-disc list-inside space-y-1">
              <li>An administrator will review your request</li>
              <li>You'll receive an email notification when approved</li>
              <li>Once approved, you can log in to access the admin dashboard</li>
            </ul>
          </div>
          
          <div className="w-full">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#00adb5] hover:bg-[#00adb5]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00adb5] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 