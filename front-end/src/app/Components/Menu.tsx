"use client";
import { useState } from "react";
import Logo from "../../../public/imgs/logo";
import styles from "./Menu.module.css";

export default function Menu() {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.menu}>
            <div className={styles.logo}>
                <Logo />
                <p>PizzaHub</p>
            </div>

            <div className={styles.hamburger} onClick={() => setOpen(!open)}>
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className={`${styles.links} ${open ? styles.linksOpen : styles.linksClosed}`}>
                <p>Início</p>
                <p>Modelos</p>
                <p>Como funciona</p>
                <p>Planos</p>
                <p>Sobre nós</p>
            </div>
            <div className={styles.suporte}>
                <a href="/auth"><button>Entrar</button></a>
                <a href="/auth"><button>Começar</button></a>
            </div>
        </div>
    )
}