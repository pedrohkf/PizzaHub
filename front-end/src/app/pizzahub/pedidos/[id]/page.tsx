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
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Itens</th>
                <th>Pagamento</th>
                <th>Total</th>
                <th>Status</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>

            <tbody>
              {pedidos.map((pedido) => (
                <tr key={pedido._id}>
                  <td data-label="Cliente">{pedido.cliente.nome}</td>
                  <td data-label="Itens">
                    {pedido.itens.map((item, i) => (
                      <div key={i}>
                        <strong>{item.nome}</strong> × {item.quantidade} — R$ {Number(item.preco).toFixed(2)}
                      </div>
                    ))}
                  </td>
                  <td data-label="Pagamento">{pedido.cliente.formaPagamento.toUpperCase()}</td>
                  <td data-label="Total"><strong>R$ {pedido.total.toFixed(2)}</strong></td>
                  <td data-label="Status" className={pedido.entregue ? styles.statusEntregue : styles.statusPendente}>
                    {pedido.entregue ? "Entregue" : "Pendente"}
                  </td>
                  <td data-label="Data">{new Date(pedido.createdAt).toLocaleString("pt-BR")}</td>
                  <td data-label="Ações">
                    <button onClick={() => atualizarStatus(pedido._id, !pedido.entregue)} className={styles.btnStatus}>
                      {pedido.entregue ? "Marcar Pendente" : "Marcar Entregue"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}