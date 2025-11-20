import { getPizzarias } from "@/app/actions/get-pizzarias";
import SideMenu from "@/app/Components/SideMenu/SideMenu";
import styles from "./pizzarias.module.css";
import Link from "next/link";
import Share from "../../../../public/imgs/Share";
import Edit from "../../../../public/imgs/Edit";
import DeleteButton from "@/app/Components/DeleteButton/DeleteButton";


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
          <h1>Pizzarias</h1>
          <Link href="pizzarias/create" className={styles.addBtn}>
            + pizzaria
          </Link>
        </div>
        <div className={styles.list}>
          {pizzarias.length > 0 ? (
            pizzarias.map((pizzaria: Pizzaria) => (
              <div className={styles.card} key={pizzaria._id}>
                <Link className={styles.mainArea} href={`pizzarias/${pizzaria._id}`} target="_blank">
                  <h2>{pizzaria.name}</h2>
                  <p><strong>Telefone:</strong> {pizzaria.phone}</p>
                  <p><strong>Endereço:</strong> {pizzaria.street}, {pizzaria.numberHouse}</p>
                  <p><strong>Bairro:</strong> {pizzaria.neighborhood}</p>
                  <p><strong>Estado:</strong> {pizzaria.state}</p>
                  <p><strong>Taxa de entrega:</strong> R$ {pizzaria.deliveryFee}</p>
                </Link>
                <div className={styles.actions}>
                  <Link href={`pizzarias/${pizzaria._id}/edit`}><Edit /></Link>
                  <Link href={`pizzarias/${pizzaria._id}`} target="_blank"><Share /></Link>
                  <DeleteButton pizzariaId={pizzaria._id} />
                </div>
              </div>
            ))
          ) : (
            <p className={styles.empty}>Nenhuma pizzaria cadastrada ainda 🍕</p>
          )}
        </div>
      </div>
    </div >
  );
}
