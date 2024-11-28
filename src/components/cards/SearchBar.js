import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto px-4">
      <form 
        onSubmit={handleSubmit} 
        className={`relative w-full bg-white rounded-full border border-gray-200 hover:shadow-md transition-all duration-200 ${
          isFocused ? 'shadow-lg border-gray-300' : ''
        }`}
      >
        <div className="flex items-center h-12">
          <div className="flex items-center flex-1 px-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="search" 
              placeholder="Search" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full h-full border-0 focus:ring-0 focus:outline-none bg-transparent px-4 text-base placeholder:text-gray-500" 
            />
          </div>
          <button
            type="submit"
            className="h-12 w-12 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
            aria-label="Search"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;