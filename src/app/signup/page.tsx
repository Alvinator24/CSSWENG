"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SelectPosition = () => {
  const [position, setPosition] = useState<string>('');
  const router = useRouter();

  const handleNextClick = () => {
    if (!position) {
      alert('Please select a position before proceeding.');
    } else {
      console.log('Selected Position:', position);
      // Redirect based on the selected position
      if (position === 'staff') {
        router.push('/signup/staff');
      } else if (position === 'manager') {
        router.push('/signup/manager');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-cream">
      <div className="w-full max-w-md p-8 space-y-6 bg-brand-cream">
        <div>
          <label htmlFor="position" className="block text-lg text-gray-700">Select Your Position</label>
          <select
            id="position"
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="" disabled>Select Position</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div>
          <button
            type="button"
            onClick={handleNextClick}
            className="w-full px-4 py-2 font-medium text-white bg-brand-brown hover:bg-brand-lgreen rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectPosition;