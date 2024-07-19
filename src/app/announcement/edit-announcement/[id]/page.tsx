'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../../lib/supabaseClient';

const EditAnnouncement = () => {
  const router = useRouter();
  const id = useParams();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [created_at, setCreatedAt] = useState<string>('');

  useEffect(() => {
    async function fetchAnnouncement() {
      try {
        const { data: announcement, error } = await supabase.from('announcement').select('*').eq('id', id).single();
        if (error) {
          throw error;
        }
        setTitle(announcement.title);
        setDescription(announcement.description);
        setCreatedAt(new Date(announcement.created_at).toISOString());
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    }

    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const updatedAnnouncement = {
      title,
      description,
      created_at,
    };

    try {
      const { error } = await supabase.from('announcement').update(updatedAnnouncement).eq('id', id);

      if (error) {
        alert(`Error updating announcement: ${error.message}`);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      alert('An error occurred while updating the announcement.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Edit Announcement</h3>
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
          <div className="space-y-4">
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Announcement
            </button>
          </div>
          <div className="text-sm text-center">
            <Link href="/admin">
              <div className="font-medium text-brand-dgreen">Return to dashboard</div>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAnnouncement;