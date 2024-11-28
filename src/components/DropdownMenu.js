import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Share2, FileText, RefreshCw } from 'lucide-react';

const DropdownMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle the dropdown menu
  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  // Close the dropdown if the user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false); // Close the dropdown
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside); // Cleanup listener
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button onClick={toggleDropdown} className="text-gray-500 hover:text-gray-700">
        <MoreVertical className="w-5 h-5" />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
          <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
            <Share2 className="w-4 h-4 mr-2" /> Share Report
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
            <FileText className="w-4 h-4 mr-2" /> Download PDF
          </button>
          <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left">
            <RefreshCw className="w-4 h-4 mr-2" /> Regenerate
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;