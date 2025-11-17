import SideMenu from "@/app/Components/SideMenu/SideMenu";
import DashboardStats from "@/app/Components/Dashboard/DashboardStats";
import { getPizzarias } from "@/app/actions/get-pizzarias";
import DashboardChart from "@/app/Components/Dashboard/DashboardChart";

export default async function Page() {
    const pizzarias = await getPizzarias();
    const pizzaria = pizzarias[0];

    return (
        <div style={{ display: "flex" }}>
            <SideMenu />
            <div style={{ flex: 1, padding: "30px" }}>
                <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>

                <DashboardStats pizzariaId={pizzaria._id} />
                <DashboardChart pizzariaId={pizzaria._id} />
            </div>
        </div>
    );
}
