"use client";

import { useEffect, useState } from "react";
import styles from "./DasboardStats.module.css"

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
    nome: string;
    preco: string;
    quantidade: number;
    pizzaId: string;
  }[];
  total: number;
  entregue: boolean;
  createdAt: string;
}

export default function DashboardStats({ pizzariaId }: { pizzariaId: string }) {
  const [pedidosMes, setPedidosMes] = useState(0);
  const [lucroMes, setLucroMes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarPedidos() {
      try {
        const res = await fetch(
          `https://pizza-hub-lime.vercel.app/api/pedidos/pizzaria/${pizzariaId}`
        );
        const data: Pedido[] = await res.json();

        const agora = new Date();
        const mesAtual = agora.getMonth();
        const anoAtual = agora.getFullYear();

        const pedidosDoMes = data.filter((p) => {
          const dataPedido = new Date(p.createdAt);
          return (
            dataPedido.getMonth() === mesAtual &&
            dataPedido.getFullYear() === anoAtual
          );
        });

        setPedidosMes(pedidosDoMes.length);

        const totalLucro = pedidosDoMes.reduce(
          (acc, pedido) => acc + pedido.total,
          0
        );

        setLucroMes(totalLucro);
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarPedidos();
  }, [pizzariaId]);


  if (loading) {
    return <p style={{ color: "#333", fontSize: "18px" }}>Carregando...</p>;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Pedidos no mês</h2>
        <p className={styles.value}>{pedidosMes}</p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Lucro do mês</h2>
        <p className={styles.value}>R$ {lucroMes.toFixed(2)}</p>
      </div>
    </div>
  );
}
