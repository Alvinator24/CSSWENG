"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Aerial from './leblanc-aerial-view.jpg';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient'

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert(error.message);
    } else {
      router.push('/manager');
    }
  };

  const handleForgotPassword = () => {
    // Implement logic for forgot password functionality, such as navigating to a forgot password page or showing a modal.
    console.log('Forgot Password clicked');
    // Example: navigate to /forgot-password route
    // Router.push('/forgot-password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
      <div className="flex justify-center">
          <Image
            src={Aerial}
            alt="Banner"
            width={400}
          />
        </div>
        <h3 className="text-lg text-center text-gray-900">Sign in to your account</h3>
        <form className="space-y-6" onSubmit={handleSignin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="w-1/2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="w-1/2 text-right">
                <Link href="/forgot-password">
                  <h2 className="text-sm text-brand-dgreen hover:text-brand-dgreen">Forgot Password?</h2>
                </Link>
              </div>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                Sign In
            </button>
          </div>
          <div className="text-sm text-center">
            <Link href="/signup">
              <h2 className="font-medium text-brand-dgreen">
                Don't have an account? Sign up
              </h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;