"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import styles from "./pedidos.module.css";
import SideMenu from "@/app/Components/SideMenu/SideMenu";

// Tipos de dados
interface Pizza {
  _id: string;
  nome: string;
  descricao: string;
  precoPequena: number;
  precoMedia: number;
  precoGrande: number;
  imagem: string;
  destaque: boolean;
  disponivel: boolean;
}

interface Categoria {
  nome: string;
  pizzas: Pizza[];
}

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
    quantidade: number;
    pizzaId: string; // Agora é só o ID, sem populate
  }[];
  total: number;
  entregue: boolean;
  createdAt: string;
}

export default function PedidosPage() {
  const { id } = useParams();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cardapio, setCardapio] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados das pizzas
  function buscarPizzaPorId(pizzaId: string) {
    for (const categoria of cardapio) {
      const pizza = categoria.pizzas.find((p) => p._id === pizzaId);
      if (pizza) return pizza;
    }
    return null;
  }

  useEffect(() => {
    if (!id) return;

    async function carregarDados() {
      try {
        // Busca os pedidos
        const pedidosRes = await fetch(
          `https://pizza-hub-lime.vercel.app/api/pedidos/pizzaria/${id}`
        );
        const pedidosData = await pedidosRes.json();

        // Busca o cardápio
        const cardapioRes = await fetch(
          `https://pizza-hub-lime.vercel.app/api/cardapio/pizzaria/${id}`
        );
        const cardapioData = await cardapioRes.json();

        setPedidos(pedidosData);
        setCardapio(cardapioData.categorias || []);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
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

            {pedido.itens.map((item, index) => {
              const pizza = buscarPizzaPorId(item.pizzaId);
              return (
                <div key={index} className={styles.item}>
                  <p>
                    <strong>Pizza:</strong>{" "}
                    {pizza ? pizza.nome : "Pizza removida do cardápio"}
                  </p>
                  <p>
                    <strong>Preço:</strong>{" "}
                    {pizza
                      ? `R$ ${pizza.precoMedia.toFixed(2)}`
                      : "Indisponível"}
                  </p>
                  <p>
                    <strong>Quantidade:</strong> {item.quantidade}
                  </p>
                </div>
              );
            })}

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
