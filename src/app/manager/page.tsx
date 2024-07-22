'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';

interface Task {
  id: number;
  title: string;
  dueDate: string;
  priorityLevel: string;
  status: string;
  staff: string;
}

const ManagerDashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data: tasks, error } = await supabase
          .from('task')
          .select('*');

        if (error) {
          throw error;
        }
        setTasks(tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, []);

  const handleDelete = async () => {
    if (selectedTaskId !== null) {
      try {
        const { error } = await supabase
          .from('task')
          .delete()
          .eq('id', selectedTaskId);

        if (error) {
          throw error;
        }

        setTasks(tasks.filter(task => task.id !== selectedTaskId));
        setIsModalOpen(false);
        setSelectedTaskId(null);
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('userEmail');
    router.push('/');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = (taskId: number) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTaskId(null);
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="relative">

        {/* Hamburger Icon */}
        {!isSidebarOpen && (
          <button className="absolute top-4 left-4 z-10 text-brown focus:outline-none" onClick={toggleSidebar}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        )}

        {/* Sidebar */}
        <div className={`fixed h-screen bg-brand-lgreen text-white p-4 flex flex-col justify-between ${isSidebarOpen ? 'left-0' : '-left-full'} transition-all duration-300 ease-in-out`}>
          <div className="flex justify-between mb-4">
            <h2 className="text-sm">BlancTrack</h2>
            <button className="text-white focus:outline-none" onClick={toggleSidebar}>
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
              <Link href="/manager">
                <h2 className="block text-white hover:text-brand-dgreen">Dashboard</h2>
              </Link>
            </li>
            <li>
              <Link href="/tasks">
                <h2 className="block text-white hover:text-brand-dgreen">Tasks</h2>
              </Link>
            </li>
          </ul>
          <div className="mt-auto flex items-center">
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
          <h1 className="text-2xl font-bold text-center mb-8">Tasks</h1>
          <div className="flex justify-end mb-4">
            <Link href="/tasks/create-task">
              <h2 className="px-4 py-2 bg-brand-brown text-white rounded hover:bg-brand-lgreen">+ Create New</h2>
            </Link>
          </div>
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <h2 className="text-lg font-bold mb-2">{task.title}</h2>
                <p className="text-sm text-gray-600">Due Date: {task.dueDate}</p>
                <p className="text-sm text-gray-600">Priority: {task.priorityLevel}</p>
                <p className="text-sm text-gray-600">Assigned to: {task.staff}</p>
                <p className={`text-sm font-bold ${task.status === 'Completed' ? 'text-green-500' : task.status === 'In Progress' ? 'text-yellow-500' : 'text-red-500'}`}>{task.status}</p>
                <div className="flex justify-end mt-4 space-x-2">
                  <Link href={`/tasks/edit-task/${task.id}`}>
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                      </svg>
                    </button>
                  </Link>
                  <button onClick={() => openModal(task.id)} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-4">
              <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-rose-500 text-white rounded hover:bg-red-400">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;