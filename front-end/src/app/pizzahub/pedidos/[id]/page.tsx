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

  return (
    <div className={styles.container}>
      <SideMenu />
      <h1>Pedidos da Pizzaria</h1>

      <div className={styles.list}>
        {pedidos.map((pedido) => (
          <div key={pedido._id} className={styles.card}>
            <h2>{pedido.cliente.nome}</h2>

            {pedido.itens.map((item, i) => (
              <div key={i}>
                <p>Pizza: {item.nome}</p>
                <p>Preço: R$ {Number(item.preco).toFixed(2)}</p>
                <p>Quantidade: {item.quantidade}</p>
              </div>
            ))}

            <p>Total: R$ {pedido.total.toFixed(2)}</p>

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