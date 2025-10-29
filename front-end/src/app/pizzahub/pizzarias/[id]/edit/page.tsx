import { getPizzariaById } from "@/app/actions/get-pizzarias-by-id";
import styles from "./edit.module.css";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pizzaria = await getPizzariaById(id);

  if (!pizzaria) {
    return <p className={styles.notFound}>Pizzaria não encontrada 🍕</p>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Editar {pizzaria.name}</h1>

      <form className={styles.form}>
        <label>Nome da pizzaria</label>
        <input type="text" defaultValue={pizzaria.name} />

        <label>Telefone</label>
        <input type="text" defaultValue={pizzaria.phone} />

        <label>Rua</label>
        <input type="text" defaultValue={pizzaria.street} />

        <label>Número</label>
        <input type="text" defaultValue={pizzaria.numberHouse} />

        <label>Bairro</label>
        <input type="text" defaultValue={pizzaria.neighborhood} />

        <label>Estado</label>
        <input type="text" defaultValue={pizzaria.state} />

        <label>Taxa de entrega</label>
        <input type="number" defaultValue={pizzaria.deliveryFee} />

        <button type="submit" className={styles.saveBtn}>
          Salvar alterações
        </button>
      </form>
    </div>
  );
}
