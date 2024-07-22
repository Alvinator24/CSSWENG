'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../lib/supabaseClient';
import bcrypt from 'bcryptjs';

const ChangePassword = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [position, setPosition] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchAccountDetails() {
      try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          throw new Error('No user email found in local storage.');
        }

        const { data: user, error } = await supabase
          .from('user')
          .select('firstname, lastname, email')
          .eq('email', userEmail)
          .single();

        if (error) {
          throw error;
        }

        setFirstName(user.firstname);
        setLastName(user.lastname);
        setEmail(user.email);

      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    }

    fetchAccountDetails();
  }, []);

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const userEmail = localStorage.getItem('userEmail');

      if (newPassword !== confirmNewPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const { error } = await supabase
        .from('user')
        .update({ password: hashedPassword })
        .eq('email', userEmail);

      if (error) {
        throw error;
      } else {
        setNewPassword('');
        setConfirmNewPassword('');
        router.push('/');
      }
      
    } catch (error) {
      console.error('Error updating account details:', error);
      alert('An error occurred while updating account details.');
    }
  };

  useEffect(() => {
    const fetchUserPosition = async () => {
      const email = localStorage.getItem('userEmail');

      try {
        const { data } = await supabase
          .from('user')
          .select('id, position')
          .eq('email', email)
          .single();

        if (data) {
          setPosition(data.position);
        }

      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUserPosition();
  }, []);


  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
          <h3 className="text-lg text-center text-gray-900">Account Details</h3>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name:</label>
              <h1 className="mt-2">{firstName}</h1>
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name:</label>
              <h1 className="mt-2">{lastName}</h1>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <h1 className="mt-2">{email}</h1>
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            {errorMessage && (
              <div className="mt-2 text-red-600 bg-white border border-red-600 rounded px-2 py-1 shadow-lg flex justify-center">{errorMessage}</div>
            )}
            <div className="space-y-4">
              <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;