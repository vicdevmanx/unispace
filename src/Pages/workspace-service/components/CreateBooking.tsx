import React from 'react';

const CreateBooking = () => {
  return (
    <form className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-[#1D3A8A]">Book a Workspace</h2>
      {/* Read-only admin fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input type="text" value="Coworking" readOnly className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Provider</label>
          <input type="text" value="Guru Devs" readOnly className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input type="text" value="Lagos, Nigeria" readOnly className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input type="text" value="conference hall" readOnly className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-500" />
        </div>
      </div>
      {/* User input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full border rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input type="time" className="w-full border rounded px-4 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Duration (hours)</label>
          <select className="w-full border rounded px-4 py-2" required>
            <option value="">Select duration</option>
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
            <option value="5">5 hours</option>
            <option value="6">6 hours</option>
            <option value="7">7 hours</option>
            <option value="8">8 hours</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Seats</label>
          <input type="number" min="1" max="20" className="w-full border rounded px-4 py-2" placeholder="e.g. 5" required />
        </div>
      </div>
      {/* Book whole space toggle */}
      <div className="flex items-center gap-3 mb-6 bg-gray-50 border rounded p-4">
        <input type="checkbox" id="wholeSpace" className="accent-[#1D3A8A]" />
        <label htmlFor="wholeSpace" className="font-medium">Book Whole Space</label>
        <span className="text-sm text-gray-500">Book all 20 seats with NGN1000 discount</span>
      </div>
      {/* Price breakdown */}
      <div className="bg-gray-50 border rounded p-4 mb-8">
        <h3 className="font-semibold mb-2">Price Breakdown</h3>
        <div className="flex flex-wrap gap-3 mb-2">
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">Duration: 2h</span>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium">Number of Seats: 20</span>
        </div>
        <div className="text-lg font-bold">Total: NGN20000</div>
      </div>
      <button type="submit" className="w-full bg-[#181B4E] text-white font-semibold py-3 rounded-lg text-lg hover:opacity-90 transition">Confirm Booking</button>
    </form>
  );
};

export default CreateBooking;