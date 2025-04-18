"use client"
import { useState } from 'react';
import { Home, ScanLine } from 'lucide-react';
import Link from 'next/link';

export default function MobileNavigation() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <nav className="flex justify-around items-center h-16">
        <Link 
          href="/" 
          className={`flex flex-col items-center justify-center w-1/2 h-full ${
            activeTab === 'home' ? 'text-green-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('home')}
        >
          <Home size={24} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </Link>
        
        <Link 
          href="/scan" 
          className={`flex flex-col items-center justify-center w-1/2 h-full ${
            activeTab === 'scan' ? 'text-green-600' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('scan')}
        >
          <ScanLine size={24} />
          <span className="text-xs mt-1 font-medium">Scan</span>
        </Link>
      </nav>
    </div>
  );
}