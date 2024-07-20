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

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<{ label: string; value: string }>({ label: 'Not Started', value: 'Not Started' });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<{ label: string; value: string | null }>({ label: 'Select Priority', value: null });
  const [staffOptions, setStaffOptions] = useState<{ label: string; value: string }[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<{ label: string; value: string | null }>({ label: 'Select Staff', value: null });
  const [managerName, setManagerName] = useState('');
  const [staffName, setStaffName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createdAt] = useState(new Date());

  useEffect(() => {
    async function fetchStaff() {
      try {
        const { data: staff, error } = await supabase.from('user').select('firstname, lastname, email').eq('position', 'staff');
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

  useEffect(() => {
    const fetchManagerName = async () => {
      const email = localStorage.getItem('userEmail');

      const { data, error } = await supabase
        .from('user')
        .select('firstname, lastname')
        .eq('email', email)
        .single();

      if (error) {
        throw error;
      }

      const managerFirstName = data?.firstname;
      const managerLastName = data?.lastname;
      const managerFullName = `${managerFirstName} ${managerLastName}`;

      setManagerName(managerFullName);
    };

    fetchManagerName();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!status.value || !dueDate || !priority.value || !selectedStaff.value) {
      setErrorMessage('Please fill out all of the fields.');
      return;
    }
    const newTask = {
      title,
      description,
      status: status.value,
      dueDate: dueDate.toISOString(),
      priorityLevel: priority.value,
      staff: staffName,
      manager: managerName,
      createdAt: createdAt.toISOString(),
    };

    const { error } = await supabase.from('task').insert([newTask]);

    if (error) {
      throw error;
    }

    router.push('/manager');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <h3 className="text-lg text-center text-gray-900">Create New Task</h3>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
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
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <Select
              id="status"
              name="status"
              value={status}
              onChange={(selectedOption) => {
                const option = selectedOption as { label: string; value: string };
                setStatus(option);
              }}
              options={[
                { label: 'Not Started', value: 'Not Started' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Completed', value: 'Completed' },
              ]}
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
            <DatePicker
              id="dueDate"
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority Level</label>
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
                { label: 'Low', value: 'Low' },
                { label: 'Medium', value: 'Medium' },
                { label: 'High', value: 'High' },
              ]}
            />
          </div>
          <div>
            <label htmlFor="staff" className="block text-sm font-medium text-gray-700">Assign To</label>
            <Select
              id="staff"
              name="staff"
              value={selectedStaff}
              onChange={(selectedOption) => {
                if (selectedOption) {
                  const option = selectedOption as { label: string; value: string };
                  setSelectedStaff(option);
                  setStaffName(option.label);
                } else {
                  setSelectedStaff({ label: 'Select Staff', value: null });
                  setStaffName('');
                }
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
          {errorMessage && (
            <div className="mt-2 text-red-600 bg-white border border-red-600 rounded px-2 py-1 shadow-lg flex justify-center">{errorMessage}</div>
          )}
          <div>
            <button type="submit" className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Create Task</button>
          </div>
          <div className="text-sm text-center">
            <Link href="/manager">
              <h2 className="font-medium text-brand-dgreen">Return to dashboard</h2>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;