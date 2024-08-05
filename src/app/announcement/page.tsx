'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';

interface Announcement {
  id: number;
  title: string;
  description: string;
  author: string;
  created_at: string;
};

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [position, setPosition] = useState('');
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const { data: announcements, error } = await supabase.from('announcement').select('*');
        if (error) {
          throw error;
        }
        setAnnouncements(announcements || []);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    }

    fetchAnnouncements();
  }, []);

  useEffect(() => {
    async function fetchPosition() {
      const email = localStorage.getItem('userEmail');
      try {
        const { data, error } = await supabase.from('user').select('position').eq('email', email).single();
        if (error) {
          throw error;
        }
        setPosition(data.position);
      } catch (error) {
        console.error('Error fetching position:', error);
      }
    }

    fetchPosition();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const email = localStorage.getItem('userEmail');
      const { data, error } = await supabase.from('user').select('id').eq('email', email).single();

      if (error) {
        console.error('Error:', error.message);
        return;
      }
      if (data) {
        setUserId(data.id);
      }
    };

    fetchUserId();
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="relative">
        {/* Hamburger Icon */}
        {!isSidebarOpen && (
          <button
            className="absolute top-4 left-4 z-10 text-brown focus:outline-none"
            onClick={toggleSidebar}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        )}


        {/* Sidebar */}
        <div className={`fixed top-0 h-full bg-brand-lgreen text-white p-4 flex flex-col ${isSidebarOpen ? 'left-0' : '-left-full'} transition-all duration-300 ease-in-out`}>
          <div className="flex justify-between mb-4">
            <h2 className="text-sm">BlancTrack</h2>
            <button className="text-white" onClick={toggleSidebar}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <ul className="space-y-2">
            <li>
              <Link href={`/account/${userId}`}>
                <h2 className="block text-white hover:text-brand-dgreen">Account</h2>
              </Link>
            </li>
            <li>
              {position === 'admin' && (
                <Link href="/admin">
                  <h2 className="font-medium text-brand-dgreen">Dashboard</h2>
                </Link>
              )}
              {position === 'manager' && (
                <Link href="/manager">
                  <h2 className="font-medium text-brand-dgreen">Dashboard</h2>
                </Link>
              )}
              {position === 'staff' && (
                <Link href="/staff">
                  <h2 className="font-medium text-brand-dgreen">Dashboard</h2>
                </Link>
              )}
            </li>
            <li>
              <Link href="/announcement">
                <h2 className="block text-white hover:text-brand-dgreen">Announcements</h2>
              </Link>
            </li>
          </ul>
          <div className="mt-36 flex items-center">
            <button onClick={() => handleLogout()} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400 flex items-center space-x-2">
              <h2 className="text-sm">Log out</h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Announcements</h1>
          <div className="space-y-4">
            {announcements.map(announcement => (
              <div key={announcement.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <h2 className="text-lg font-bold mb-2">{announcement.title}</h2>
                <p className="text-sm text-gray-600">{announcement.description}</p>
                <h3 className="text-sm text-gray-600 mt-5">Published by {announcement.author} on {announcement.created_at}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementsPage;