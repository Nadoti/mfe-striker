'use client'

import Link from "next/link";
import { GoHomeFill } from "react-icons/go";
import { GrTransaction } from "react-icons/gr";
import { FiLogOut } from "react-icons/fi";

import './navbar.css';
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo/logo";



export function Navbar() {

    const pathname = usePathname();
    console.log(pathname);

  return (
    <section className="navbar-container">
      <div className="navbar-content">
        <Logo width={120} height={120} />
        <nav className="navbar-nav">
            <ul>
                <li className={pathname === "/dashboard/home" ? "active" : ""}>
                    <Link href="dashboard/home">
                        <GoHomeFill size={30} color={pathname === "/dashboard/home" ? "#4F46E5" : "#757171"}/>
                    </Link>
                </li>
                <li className={pathname === "/dashboard/transactions" ? "active" : ""}>
                    <Link href="dashboard/transactions">
                        <GrTransaction size={30} color={pathname === "/dashboard/transactions" ? "#007bff" : "#757171"}/>
                    </Link>
                </li>
                {/* <li>
                    <Link href="/login">
                        <GoHomeFill />
                    </Link>
                </li> */}
            </ul>

            <div className="navbar-logout">
                <button className="navbar-logout-button">
                    <FiLogOut size={30} color="#FiLogOut"/>
                </button>
            </div>
        </nav>
      </div>
    </section>
  );
}