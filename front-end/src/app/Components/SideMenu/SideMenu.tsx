"use client"
import styles from './SideMenu.module.css'

import Link from 'next/link';
import { useEffect, useState } from 'react'


const menuItems = [
    { to: "dashboard", label: "Dashboard", icon: "" },
    { to: "pizzarias", label: "Pizzarias", icon: "" },
    { to: "cardapios", label: "Cardápios", icon: "" },
    { to: "pedidos", label: "Pedidos", icon: "" },
    { to: "help", label: "Ajuda", icon: "" },
];

export default function SideMenu() {
    const [activeLink, setActiveLink] = useState<string>("/dashboard");
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => setIsSmallScreen(window.innerWidth <= 500);

        checkScreenSize();

        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, [])


    const handleClick = (event: React.MouseEvent<HTMLLIElement>) => {
        event.preventDefault()
        const clickedPath = event.currentTarget.getAttribute("href");

        if (clickedPath) setActiveLink(clickedPath);
    };

    return (
        <div className={styles.container}>
            <div onClick={() => setIsSmallScreen(!isSmallScreen)}>
                <div className={isSmallScreen ? styles.menuBarDesactived : styles.menuBarActived} />
            </div>

            <div className={isSmallScreen ? styles.menuLayoutDesactived : styles.menuLayout}>
                <ul className={styles.menu}>
                    {menuItems.map((item) => (
                        <li
                            key={item.to}
                            className={activeLink === item.to ? styles.active : ""}
                            onClick={handleClick}
                        >
                            <Link href={"/pizzahub/" + item.to} className={styles.icon}>{item.icon}</Link>
                            <Link href={"/pizzahub/" + item.to} className={styles.text}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className={styles.exit}>
                    <li>Sair</li>
                </ul>
            </div>
        </div >
    );
}