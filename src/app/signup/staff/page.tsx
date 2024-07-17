"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../lib/supabaseClient';

const SignUpStaff = () => {
  const router = useRouter();

  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobilenumber, setMobilenumber] = useState<string>('');
  const [manager, setManager] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [managers, setManagers] = useState<{ label: string, value: string }[]>([]);
  const [sector, setSector] = useState<string>('');

  useEffect(() => {
    const fetchManagers = async () => {
      const { data, error } = await supabase.from('manager').select('firstname, lastname, email');
      if (error) {
        console.error('Error fetching managers:', error);
      } else {
        setManagers(data.map((manager: { firstname: string, lastname: string, email: string }) => ({
          label: `${manager.firstname} ${manager.lastname}`,
          value: manager.email
        })));
      }
    };
    fetchManagers();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== passwordConfirmation) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError('');

    const { data, error } = await supabase.from('staff').insert([
      {
        firstname,
        lastname,
        email,
        mobilenumber,
        manager,
        sector,
        password,
      },
    ]);

    if (error) {
      console.error('Error inserting data:', error);
      alert(`Error inserting data: ${error.message}`);
      return;
    }

    console.log('Data inserted:', data);

    router.push('/');
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handlePasswordConfirmationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirmation(e.target.value);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Sign up for an account</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                id="firstname"
                name="firstname"
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="mobilenumber" className="block text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              id="mobilenumber"
              name="mobilenumber"
              type="tel"
              value={mobilenumber}
              onChange={(e) => setMobilenumber(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="sector" className="block text-sm font-medium text-gray-700">Sector</label>
            <select
              id="sector"
              name="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select Sector</option>
              <option value="helpdesk">Helpdesk</option>
              <option value="customer-service">Customer Service</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label htmlFor="manager" className="block text-sm font-medium text-gray-700">Manager</label>
            <select
              id="manager"
              name="manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Select Manager</option>
              {managers.map((managerOption) => (
                <option key={managerOption.value} value={managerOption.value}>
                  {managerOption.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700">Re-enter Password</label>
            <input
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
              required
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
              Sign Up
            </button>
          </div>
          <div className="text-sm text-center">
            <Link href="/login">
              <h2 className="font-medium text-brand-dgreen">
                Already have an account? Sign in
              </h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpStaff;