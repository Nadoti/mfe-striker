'use client'

import { useState } from "react";
import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import { FaUser } from "react-icons/fa";

import { FiLogOut, FiMenu, FiX } from "react-icons/fi";
import './navbar.css';
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo/logo";
import { LogoutModal } from "../logout-modal/logout-modal";
import { toast } from "sonner";

export function Navbar() {
    const pathname = usePathname();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);

        try {
            const { supabase } = await import('@/lib/supabase');
            await supabase.auth.signOut();
            
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_refresh_token');
            localStorage.removeItem('auth_session');
            
            toast.success('Logout realizado com sucesso!');
            
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            toast.error('Erro ao fazer logout');
            setIsLoggingOut(false);
        }
    };

  return (
    <>
      <button 
        className="navbar-hamburger" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
      </button>

      <section className={`navbar-container ${isMenuOpen ? "open" : ""}`}>
        <div className="navbar-content">
            
            <div className="logo-show-desktop">
                <Logo size="medium" />
            </div>
            <div className="logo-show-mobile">
                <Logo size="small" />
            </div>
          <nav className="navbar-nav">
            <ul className="navbar-menu">
              <li className={`navbar-menu-item ${pathname === "/dashboard/home" ? "active" : ""}`}>
                <Link href="/dashboard/home" onClick={() => setIsMenuOpen(false)}>
                  <GoHomeFill size={30} color={pathname === "/dashboard/home" ? "#4F46E5" : "#757171"} />
                </Link>
              </li>
              <li className={`navbar-menu-item ${pathname === "/dashboard/transactions" ? "active" : ""}`}>
                <Link href="/dashboard/transactions" onClick={() => setIsMenuOpen(false)}>
                  <GrTransaction size={30} color={pathname === "/dashboard/transactions" ? "#4F46E5" : "#757171"} />
                </Link>
              </li>
              <li className={`navbar-menu-item ${pathname === "/dashboard/profile" ? "active" : ""}`}>
                <Link href="/dashboard/profile" onClick={() => setIsMenuOpen(false)}>
                  <FaUser size={28} color={pathname === "/dashboard/profile" ? "#4F46E5" : "#757171"} />
                </Link>
              </li>
            </ul>
            <div className="navbar-logout">
              <button 
                className="navbar-logout-button" 
                onClick={() => setIsLogoutModalOpen(true)}
              >
                <FiLogOut size={30} color="#ef4444" />
              </button>
            </div>
          </nav>
        </div>

        <LogoutModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
          loading={isLoggingOut}
        />
      </section>
    </>
  );
}