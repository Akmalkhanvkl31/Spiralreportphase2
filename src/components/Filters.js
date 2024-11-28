import React from 'react';
import { Search } from 'lucide-react';

const Filters = ({ searchTerm, setSearchTerm, selectedFramework, setSelectedFramework, selectedMaturity, setSelectedMaturity }) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <div className="flex flex-row gap-4">
        <div className="flex-1 flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search assessments..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <select
            className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
          >
            <option value="all">All Frameworks</option>
            <option value="ISO 27001">ISO 27001</option>
            <option value="GDPR">GDPR</option>
            <option value="NIST CSF">NIST CSF</option>
          </select>
        </div>
        <select
          className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
          value={selectedMaturity}
          onChange={(e) => setSelectedMaturity(e.target.value)}
        >
          <option value="all">All Maturity Levels</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
