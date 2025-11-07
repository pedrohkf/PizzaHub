import { getPizzarias } from "@/app/actions/get-pizzarias";
import SideMenu from "@/app/Components/SideMenu/SideMenu";
import styles from "./Pizzaria.module.css";
import Link from "next/link";

interface Pizzaria {
  _id: string;
  name: string;
  phone: string;
  street: string;
  numberHouse: string;
  neighborhood: string;
  state: string;
  deliveryFee: string;
}


export default async function Page() {
  const pizzarias = await getPizzarias();

  return (
    <div className={styles.container}>
      <SideMenu />
      <div className={styles.content}>
        <div className={styles.header}>
          <h1>Pedidos por Pizzaria</h1>
          <Link href="pizzarias/create" className={styles.addBtn}>
            + pizzaria
          </Link>
        </div>
        <div className={styles.list}>
          {pizzarias.length > 0 ? (
            pizzarias.map((pizzaria: Pizzaria) => (
              <Link href={`pedidos/${pizzaria._id}`} key={pizzaria._id} className={styles.cardLink}>
                <div className={styles.card}>
                  <h2>{pizzaria.name}</h2>
                  <p><strong>Telefone:</strong> {pizzaria.phone}</p>
                  <p><strong>Endereço:</strong> {pizzaria.street}, {pizzaria.numberHouse}</p>
                  <p><strong>Bairro:</strong> {pizzaria.neighborhood}</p>
                  <p><strong>Estado:</strong> {pizzaria.state}</p>
                  <p><strong>Taxa de entrega:</strong> R$ {pizzaria.deliveryFee}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className={styles.empty}>Nenhuma pizzaria cadastrada ainda 🍕</p>
          )}
        </div>
      </div>
    </div >
  );
}
