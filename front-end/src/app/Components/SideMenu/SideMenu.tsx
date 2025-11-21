"use client"
import styles from './SideMenu.module.css'

import Link from 'next/link';
import { useEffect, useState } from 'react'
import Dashboard from "../../../../public/imgs/Dashboard";
import Pizzaria from "../../../../public/imgs/Pizzaria";
import Orders from "../../../../public/imgs/Orders";
import Exit from "../../../../public/imgs/Exit";
import Menu from "../../../../public/imgs/Menu";
import { ExitAccount } from '@/app/actions/exit-account';

const menuItems = [
    { to: "dashboard", label: "Dashboard", icon: <Dashboard /> },
    { to: "pizzarias", label: "Pizzarias", icon: <Pizzaria /> },
    { to: "pedidos", label: "Pedidos", icon: <Orders /> },
];

export default function SideMenu() {
    const [activeLink, setActiveLink] = useState<string>("/dashboard");
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 1000);
        check();

        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleItemClick = (path: string) => {
        setActiveLink(path);
        if (isMobile) setIsMenuOpen(false);
    };

    const shouldShowMenu = isMobile ? isMenuOpen : true;

    return (
        <div className={styles.container}>
            {isMobile && (
                <button className={styles.menuButton} onClick={toggleMenu}>
                    <Menu />
                </button>
            )}

            <nav className={shouldShowMenu ? styles.menuOpen : styles.menuClosed}>
                <ul className={styles.menu}>
                    {menuItems.map((item) => (
                        <li
                            key={item.to}
                            className={activeLink === item.to ? styles.active : ""}
                            onClick={() => handleItemClick(item.to)}
                        >
                            <Link href={`/pizzahub/${item.to}`} className={styles.icon}>
                                {item.icon}
                            </Link>

                            <Link href={`/pizzahub/${item.to}`} className={styles.text}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <ul className={styles.exit} onClick={() => ExitAccount()}>
                    <Exit />
                    <li>Sair</li>
                </ul>
            </nav>
        </div >
    );
}