'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './components/navbar/navbar';
import { Header } from './components/header/header';
import './dashboard.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="dashboard-container">
      <Navbar />

      <div>
        <Header />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

