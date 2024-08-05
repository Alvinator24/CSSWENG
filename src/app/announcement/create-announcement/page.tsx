'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../lib/supabaseClient';

const CreateAnnouncement = () => {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [created_at] = useState(new Date());
  const [authorName, setAuthorName] = useState('');
  const [position, setPosition] = useState('');

  useEffect(() => {
    const fetchPosition = async () => {
      const email = localStorage.getItem('userEmail');
      const { data, error } = await supabase
        .from('user')
        .select('position')
        .eq('email', email)
        .single();

      if (error) {
        throw error;
      }
      if (data) {
        setPosition(data.position);
      }
    };

    fetchPosition();
  }, []);

  useEffect(() => {
    if (position && position != 'admin') {
      router.push(`/${position}`);
    }
  }, [position]);

  useEffect(() => {
    const fetchAuthorName = async () => {
      const email = localStorage.getItem('userEmail');

      const { data, error } = await supabase
        .from('user')
        .select('firstname, lastname')
        .eq('email', email)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      const authorFirstName = data?.firstname;
      const authorLastName = data?.lastname;
      const authorFullName = `${authorFirstName} ${authorLastName}`;

      setAuthorName(authorFullName);
    };

    fetchAuthorName();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newAnnouncement = {
      title,
      description,
      author: authorName,
      created_at: new Date().toLocaleDateString(),
    };

    try {
      const { error } = await supabase.from('announcement').insert([newAnnouncement]);

      if (error) {
        console.error(error);
      }

      router.push('/admin');
    } catch (error) {
      console.error(`Error inserting data: ${error}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Create New Announcement</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-900">
              <p>Today is: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Create</button>
          </div>
          <div className="text-sm text-center">
            <Link href="/admin">
              <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAnnouncement;