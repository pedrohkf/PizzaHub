"use client";
import SideMenu from "@/app/Components/SideMenu/SideMenu";
import Modal from "../../../Components/Pizzaria/modal"

import styles from "./create.module.css"


export default function Page() {

    return (
        <div className={styles.container}>
            <SideMenu />
            <Modal />
        </div>  
    )
}              