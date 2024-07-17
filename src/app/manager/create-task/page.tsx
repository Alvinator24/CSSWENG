'use client'

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Select from 'react-select';
import supabase from '../../../lib/supabaseClient';

const CreateTask = () => {
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [status, setStatus] = useState<{ label: string; value: string }>({ label: 'Not Started', value: 'not_started' });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<{ label: string; value: string | null }>({ label: 'Select Priority', value: null });
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<{ label: string; value: string | null }>({ label: 'Select Staff', value: null });
  const [createdAt] = useState(new Date());

  useEffect(() => {
    async function fetchStaff() {
      try {
        const { data: staff, error } = await supabase.from('staff').select('firstname, lastname, email');
        if (error) {
          throw error;
        }
        const options = staff.map((member: any) => ({
          label: `${member.firstname} ${member.lastname}`,
          value: member.email
        }));
        setStaffOptions(options);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    }

    fetchStaff();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (status.value === null || priority.value === null || selectedStaff.value === null) {
      alert('Please select a valid status, priority, and staff.');
      return;
    }

    const newTask = {
      title,
      description,
      status: status.value,
      dueDate: dueDate?.toISOString(),
      priorityLevel: priority.value,
      staff: selectedStaff.value,
      createdAt: createdAt.toISOString(),
    };

    const { error } = await supabase.from('task').insert([newTask]);

    if (error) {
      alert(`Error inserting data: ${error.message}`)
    }

    router.push('/manager');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Create New Task</h3>
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
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <Select
              id="status"
              name="status"
              value={status}
              onChange={(selectedOption) => {
                const option = selectedOption as { label: string; value: string };
                setStatus(option);
              }}
              options={[
                { label: 'Not Started', value: 'not_started' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
              ]}
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <DatePicker
              id="dueDate"
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority Level
            </label>
            <Select
              id="priority"
              name="priority"
              value={priority}
              onChange={(selectedOption) => {
                const option = selectedOption as { label: string; value: string };
                setPriority(option);
              }}
              options={[
                { label: 'Select Priority', value: null },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
              ]}
            />
          </div>
          <div>
            <label htmlFor="staff" className="block text-sm font-medium text-gray-700">
              Assign To
            </label>
            <Select
              id="staff"
              name="staff"
              value={selectedStaff}
              onChange={(selectedOption) => {
                const option = selectedOption as { label: string; value: string };
                setSelectedStaff(option);
              }}
              options={staffOptions}
              placeholder="Search staff"
              isClearable
              isSearchable
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-900">
              <p>Today is: {createdAt.toLocaleDateString()}</p>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Create Task
            </button>
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

export default CreateTask;