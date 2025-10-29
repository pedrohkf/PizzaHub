import { getPizzarias } from "@/app/actions/get-pizzarias";
import SideMenu from "@/app/Components/SideMenu/SideMenu";
import styles from "./pizzarias.module.css";
import Link from "next/link";

export default async function Page() {
  const pizzarias = await getPizzarias();

  return (
    <div className={styles.container}>
      <SideMenu />
      <div className={styles.header}>
        <h1>Pizzarias</h1>
        <Link href="/pizzarias/create" className={styles.addBtn}>
          + pizzaria
        </Link>
      </div>

      <div className={styles.list}>
        {pizzarias.length > 0 ? (
          pizzarias.map((pizzaria: any) => (
            <div key={pizzaria._id} className={styles.card}>
              <h2>{pizzaria.name}</h2>
              <p><strong>Telefone:</strong> {pizzaria.phone}</p>
              <p><strong>Endereço:</strong> {pizzaria.street}, {pizzaria.numberHouse}</p>
              <p><strong>Bairro:</strong> {pizzaria.neighborhood}</p>
              <p><strong>Estado:</strong> {pizzaria.state}</p>
              <p><strong>Taxa de entrega:</strong> R$ {pizzaria.deliveryFee}</p>
            </div>
          ))
        ) : (
          <p className={styles.empty}>Nenhuma pizzaria cadastrada ainda 🍕</p>
        )}
      </div>
    </div>
  );
}
