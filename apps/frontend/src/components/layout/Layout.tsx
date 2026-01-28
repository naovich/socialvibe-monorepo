import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Header />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 lg:ml-72 xl:mr-80 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">
            {children}
          </div>
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Layout;
