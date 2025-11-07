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
  itens: {
    nome: string,
    preco: string,
    quantidade: number;
    pizzaId: string;
  }[];
  total: number;
  entregue: boolean;
  createdAt: string;
}

export default function PedidosPage() {
  const { pizzariaId } = useParams();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  useEffect(() => {
    console.log(pizzariaId)

    async function carregarDados() {
      try {
        const pedidosRes = await fetch(
          `https://pizza-hub-lime.vercel.app/api/pedidos/pizzaria/${pizzariaId}`
        );
        const pedidosData = await pedidosRes.json();

        console.log("pedidosData:", pedidosData);
        setPedidos(pedidosData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      }
    }

    carregarDados();
  }, [pizzariaId]);

  async function atualizarStatus(id: string, entregue: boolean) {
    try {
      console.log(id, entregue)

      const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pedidos/entrega/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entregue }),
      });

      const data = await res.json();
      console.log("Atualizado:", data);

      // Atualiza o estado local (para não precisar recarregar a página)
      setPedidos((prev) =>
        prev.map((p) => (p._id === id ? { ...p, entregue } : p))
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  }


  return (
    <div className={styles.container}>
      <SideMenu />
      <div className={styles.list}>
        <h1>Pedidos da Pizzaria</h1>

        <div className={styles.pedidos}>
          {pedidos.map((pedido) => (
            <div key={pedido._id} className={styles.card}>
              <h2>{pedido.cliente.nome}</h2>

              <p className={styles.formaPagamento}>
                💳 {pedido.cliente.formaPagamento.toUpperCase()}
              </p>

              {pedido.itens.map((item, i) => (
                <div key={i} className={styles.item}>
                  <p><strong>{item.nome} | x{item.quantidade}</strong></p>
                  <p className={styles.quantidade}></p>
                  <p className={styles.preco}>R$ {Number(item.preco).toFixed(2)}</p>
                </div>
              ))}

              <p className={styles.total}>Total: R$ {pedido.total.toFixed(2)}</p>

              <div className={styles.status}>
                <strong className={
                  pedido.entregue
                    ? `${styles.statusText} ${styles.statusEntregue}`
                    : `${styles.statusText} ${styles.statusPendente}`
                }>Status: {pedido.entregue ? "Entregue" : "Pendente"}</strong>

                <button
                  onClick={() => atualizarStatus(pedido._id, !pedido.entregue)}
                  className={styles.btnStatus}
                >
                  {pedido.entregue ? "Marcar como Pendente" : "Marcar como Entregue"}
                </button>
              </div>


              <p className={styles.data}>
                📅 {new Date(pedido.createdAt).toLocaleString("pt-BR")}
              </p>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
}