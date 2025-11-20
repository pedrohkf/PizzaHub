import SideMenu from "@/app/Components/SideMenu/SideMenu";
import DashboardStats from "@/app/Components/Dashboard/DashboardStats";
import { getPizzarias } from "@/app/actions/get-pizzarias";
import DashboardChart from "@/app/Components/Dashboard/DashboardChart";
import DashboardOrdersChart from "@/app/Components/Dashboard/DashboardOrdersChart";

import styles from "./Dashboard.module.css"

export default async function Page() {
    const pizzarias = await getPizzarias();
    const pizzaria = pizzarias[0];

    return (
        <div className={styles.container}>
            <SideMenu />
            <div className={styles.content}>
                <h1>Dashboard</h1>

                <DashboardStats pizzariaId={pizzaria._id} />
                <div className={styles.graphs}>
                    <DashboardChart pizzariaId={pizzaria._id} />
                    <DashboardOrdersChart pizzariaId={pizzaria._id} />
                </div>
            </div>
        </div>
    );
}
