'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';

const ForgotPassword = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [song, setSong] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const { data: user, error } = await supabase
        .from('user')
        .select('song, id')
        .eq('email', email)
        .single();

      if (error) {
        setErrorMessage('User does not exist.');
        return;
      }

      if (user.song.toLowerCase() === song.toLowerCase()) {
        localStorage.setItem('userEmail', email);
        router.push(`/account/${user.id}`);
      } else {
        setErrorMessage('Incorrect song title. Try again.');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Forgot Password Facility</h3>
        <form className="space-y-6" onSubmit={handleForgotPassword}>
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
            <label htmlFor="song" className="block text-sm font-medium text-gray-700">Title of your favorite song</label>
            <input
              id="song"
              name="song"
              type="text"
              value={song}
              onChange={(e) => setSong(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errorMessage && (
            <div className="mt-2 text-red-600 bg-white border border-red-600 rounded px-2 py-1 shadow-lg flex justify-center">{errorMessage}</div>
          )}
          <div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded">Next</button>
          </div>
          <div className="text-sm text-center">
            <Link href="/login">
              <h2 className="font-medium text-brand-dgreen">Back</h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;