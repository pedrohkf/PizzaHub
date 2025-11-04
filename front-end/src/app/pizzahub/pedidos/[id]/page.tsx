"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./pedidos.module.css";
import SideMenu from "@/app/Components/SideMenu/SideMenu";

interface Pedido {
  _id: string;
  cliente: {
    nome: string;
    endereco: string;
    telefone: string;
    cpf: string;
    formaPagamento: string;
  };
  total: number;
  entregue: boolean;
  createdAt: string;
}

export default function PedidosPage() {
  const { id } = useParams();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchPedidos() {
      try {
        const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pedidos/pizzaria/${id}`);
        const data = await res.json();
        setPedidos(data);
      } catch (err) {
        console.error("Erro ao carregar pedidos:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPedidos();
  }, [id]);

  if (loading) return <p className={styles.loading}>Carregando pedidos...</p>;

  if (pedidos.length === 0)
    return <p className={styles.empty}>Nenhum pedido foi feito ainda 🍕</p>;

  return (
    <div className={styles.container}>
      <SideMenu />
      <h1>Pedidos da Pizzaria</h1>
      <div className={styles.list}>
        {pedidos.map((pedido) => (
          <div key={pedido._id} className={styles.card}>
            <h2>{pedido.cliente.nome}</h2>
            <p><strong>Endereço:</strong> {pedido.cliente.endereco}</p>
            <p><strong>Telefone:</strong> {pedido.cliente.telefone}</p>
            <p><strong>CPF:</strong> {pedido.cliente.cpf}</p>
            <p><strong>Forma de Pagamento:</strong> {pedido.cliente.formaPagamento}</p>
            <p><strong>Total:</strong> R$ {pedido.total.toFixed(2)}</p>
            <p>
              <strong>Status:</strong>{" "}
              {pedido.entregue ? (
                <span className={styles.entregue}>Entregue</span>
              ) : (
                <span className={styles.pendente}>Pendente</span>
              )}
            </p>
            <p>
              <strong>Data:</strong>{" "}
              {new Date(pedido.createdAt).toLocaleString("pt-BR")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
