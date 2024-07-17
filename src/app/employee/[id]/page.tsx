"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AccountSettings = () => {
  const router = useRouter();

  // Mock user data for initial state (replace with actual user data retrieval logic)
  const [userData, setUserData] = useState({
    firstname: 'John',
    lastname: 'Doe',
    email: 'john.doe@example.com',
    mobilenumber: '+1234567890',
    position: 'staff',
    sector: 'helpdesk',
  });

  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleSaveChanges = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle save changes logic here
    if (newPassword !== passwordConfirmation) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Example: Update user data with API call
    const updatedUserData = {
      ...userData,
      ...(password && { password }), // Update password if provided
      ...(newPassword && { newPassword }), // Update newPassword if provided
    };
    console.log('Updated User Data:', updatedUserData);

    // Reset password error and clear password fields
    setPassword('');
    setNewPassword('');
    setPasswordConfirmation('');
    setPasswordError('');

    router.push('/');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Account Settings</h3>
        <form className="space-y-6" onSubmit={handleSaveChanges}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={userData.firstname}
                onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={userData.lastname}
                onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="mobilenumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              id="mobilenumber"
              name="mobilenumber"
              type="tel"
              value={userData.mobilenumber}
              onChange={(e) => setUserData({ ...userData, mobilenumber: e.target.value })}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-gray-700">Position</label>
            <select
              id="position"
              name="position"
              value={userData.position}
              onChange={(e) => setUserData({ ...userData, position: e.target.value })}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sector</label>
            <select
              id="sector"
              name="sector"
              value={userData.sector}
              onChange={(e) => setUserData({ ...userData, sector: e.target.value })}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="helpdesk">Helpdesk</option>
              <option value="customer-service">Customer Service</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
          <div className="text-sm text-center">
            <Link href="/login">
              <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettings;
