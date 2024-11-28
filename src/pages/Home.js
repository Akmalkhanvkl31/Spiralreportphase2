import React from 'react';
import { Button } from "../components/ui/Button";
import log from '../assets/SpiralReports Logo White.jpg'; 
import { Link } from 'react-router-dom'; 
import SearchBar from '../components/cards/SearchBar'; // Import the SearchBar

export default function Component() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full p-4 flex justify-between items-center">
        <Button variant="outline" asChild className="rounded-full px-6 py-2 border border-[#EF4444] text-[#EF4444]">
          <Link to="#">Go to Website</Link>
        </Button>
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="ghost" style={{ backgroundColor: '#EF4444', color: 'white' }} className="px-4 py-2">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="ghost" style={{ backgroundColor: '#EF4444', color: 'white' }} className="px-4 py-2">SignUp</Button>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md relative" style={{ marginBottom: '60px' }}>
          <img 
            src={log} 
            alt="Logo" 
            className="mx-auto mb-4"
            style={{ width: '200px', height: 'auto', marginBottom: '10px' }}
          />
          <div className="relative" style={{ marginBottom: '200px' }}>
            {/* Replace the existing search input with SearchBar */}
            <SearchBar onSearch={(term) => console.log(term)} />
          </div>
        </div>
      </main>
    </div>
  );
}
