'use client'

import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";
import { FaUser } from "react-icons/fa";

import './navbar.css';
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo/logo";



export function Navbar() {

    const pathname = usePathname();

    const handleLogout = async () => {
        if (confirm('Deseja sair da sua conta?')) {
            const { supabase } = await import('@/lib/supabase');
            await supabase.auth.signOut();
            localStorage.removeItem('auth_session');
            alert('✅ Logout realizado com sucesso!');
            window.location.href = '/login';
        }
    };

  return (
    <section className="navbar-container">
      <div className="navbar-content">
        <Logo width={120} height={120} />
        <nav className="navbar-nav">
            <ul>
                <li className={pathname === "/dashboard/home" ? "active" : ""}>
                    <Link href="/dashboard/home">
                        <GoHomeFill size={30} color={pathname === "/dashboard/home" ? "#4F46E5" : "#757171"}/>
                    </Link>
                </li>
                <li className={pathname === "/dashboard/transactions" ? "active" : ""}>
                    <Link href="/dashboard/transactions">
                        <GrTransaction size={30} color={pathname === "/dashboard/transactions" ? "#007bff" : "#757171"}/>
                    </Link>
                </li>
                <li className={pathname === "/dashboard/profile" ? "active" : ""}>
                    <Link href="/dashboard/profile">
                        <FaUser size={28} color={pathname === "/dashboard/profile" ? "#10b981" : "#757171"}/>
                    </Link>
                </li>
            </ul>

            <div className="navbar-logout">
                <button className="navbar-logout-button" onClick={handleLogout}>
                    <FiLogOut size={30} color="#ef4444"/>
                </button>
            </div>
        </nav>
      </div>
    </section>
  );
}