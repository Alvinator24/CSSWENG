'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import supabase from '../../../lib/supabaseClient';

const Select = dynamic(() => import('react-select'), { ssr: false });

const UpdateStatus = () => {
  const router = useRouter();
  const taskId = useParams().id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<{ label: string; value: string }>({ label: 'Select Status', value: '' });

  useEffect(() => {
    async function fetchTask() {
      try {
        const { data: task, error } = await supabase.from('task').select('*').eq('id', taskId).single();
        if (error) {
          throw error;
        }
        setTitle(task.title);
        setDescription(task.description);
        setStatus({ label: task.status.replace('_', ' '), value: task.status });
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    }

    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!status.value) {
      alert('Please select a valid status.');
      return;
    }

    const updatedStatus = {
      status: status.value
    };

    try {
      const { error } = await supabase.from('task').update(updatedStatus).eq('id', taskId);

      if (error) {
        throw error;
      } else {
        router.push('/staff');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('An error occurred while updating the task.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Update Task Status</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <p id="title" className="mt-1 text-gray-900">{title}</p>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description:
            </label>
            <p id="description" className="mt-1 text-gray-900">{description}</p>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select
              id="status"
              name="status"
              value={status}
              onChange={(selectedOption) => setStatus(selectedOption as { label: string; value: string })}
              options={[
                { label: 'Select Status', value: null },
                { label: 'Not Started', value: 'Not Started' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
              ]}
              required
            />
          </div>
          <div className="space-y-4">
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Update Status</button>
          </div>
          <div className="text-sm text-center">
            <Link href="/staff">
              <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatus;