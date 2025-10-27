"use client";
import SideMenu from "@/app/Components/SideMenu/SideMenu";
import styles from "./pizzarias.module.css"
import Link from "next/link";

export default function Page() {

    return (
        <div className={styles.container}>
            <SideMenu />
            <div className={styles.newBlog}>
                    <Link href='pizzarias/addPizzaria'>+ BLOG</Link>
                </div>
        </div>
    )
}              