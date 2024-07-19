"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../lib/supabaseClient';

const AccountDetails = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [position, setPosition] = useState<string | null>(null);
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

      const updates = {
        firstname: firstName,
        lastname: lastName,
        email: email,
      };

      if (newPassword) {
        if (newPassword !== confirmNewPassword) {
          alert('Passwords do not match.');
          return;
        }

      }

      const { error } = await supabase
        .from('user')
        .update(updates)
        .eq('email', userEmail);

      if (error) {
        alert(`Error updating account details: ${error.message}`);
      } else {
        setNewPassword('');
        setConfirmNewPassword('');
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

  const handleDelete = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        throw new Error('No user email found in local storage.');
      }

      const { error } = await supabase
        .from('managers')
        .delete()
        .eq('email', userEmail);

      if (error) {
        alert(`Error deleting account: ${error.message}`);
      } else {
        alert('Account deleted successfully!');
        localStorage.removeItem('userEmail');
        router.push('/login');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('An error occurred while deleting the account.');
    } finally {
      closeModal();
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
          <h3 className="text-lg text-center text-gray-900">Account Details</h3>
          <form className="space-y-6" onSubmit={handleUpdate}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
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
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="space-y-4">
              <button
                type="submit"
                className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update
              </button>
            </div>
            <div className="space-y-4">
              <button
                type="button"
                onClick={openModal}
                className="w-full px-4 py-2 font-medium text-white bg-red-500 hover:bg-red-700 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Account
              </button>
            </div>
            <div className="text-sm text-center mt-4">
              {position === 'admin' && (
                <Link href="/admin">
                  <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
                </Link>
              )}
              {position === 'manager' && (
                <Link href="/manager">
                  <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
                </Link>
              )}
              {position === 'staff' && (
                <Link href="/staff">
                  <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
                </Link>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete your account?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountDetails;