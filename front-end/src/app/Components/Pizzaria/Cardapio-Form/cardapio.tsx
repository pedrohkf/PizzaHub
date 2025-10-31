"use client";

import { useState } from "react";
import { postCardapio } from "@/app/actions/post-cardapio";
import styles from "./CardapioForm.module.css";
import { useAuth } from "@/context/AuthContext";

interface Pizza {
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

interface Cardapio {
    categorias: Categoria[];
}

export default function CardapioForm() {
    const [cardapio, setCardapio] = useState<Cardapio>({ categorias: [] });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const { user } = useAuth();


    function adicionarCategoria() {
        setCardapio((prev) => ({
            categorias: [...prev.categorias, { nome: "", pizzas: [] }],
        }));
    }

    function alterarNomeCategoria(index: number, nome: string) {
        const novasCategorias = [...cardapio.categorias];
        novasCategorias[index].nome = nome;
        setCardapio({ categorias: novasCategorias });
    }

    function adicionarPizza(cIndex: number) {
        const novasCategorias = [...cardapio.categorias];
        novasCategorias[cIndex].pizzas.push({
            nome: "",
            descricao: "",
            precoPequena: 0,
            precoMedia: 0,
            precoGrande: 0,
            imagem: "",
            destaque: false,
            disponivel: true,
        });
        setCardapio({ categorias: novasCategorias });
    }

    function alterarPizza(
        cIndex: number,
        pIndex: number,
        campo: keyof Pizza,
        valor: string | number | boolean
    ) {
        const novasCategorias = [...cardapio.categorias];
        const pizzaAtualizada = { ...novasCategorias[cIndex].pizzas[pIndex], [campo]: valor };
        novasCategorias[cIndex].pizzas[pIndex] = pizzaAtualizada;
        setCardapio({ categorias: novasCategorias });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            if (!user || !user.id) {
                alert("Usuário não encontrado. Faça login novamente.");
                return;
            }

            await postCardapio(cardapio, user.id);
            alert("Cardápio criado com sucesso!");
            setCardapio({ categorias: [] });
        } catch (error) {
            console.error(error);
            alert("Erro ao criar cardápio!");
        } finally {
            setLoading(false);
        }
    }

    function abrirModal() {
        setIsOpen(true);
    }

    function fecharModal() {
        setIsOpen(false);
    }



    return (
        <>
            {isOpen ? (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={fecharModal}>×</button>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <h2>Cardápio</h2>
                            {cardapio.categorias.map((cat, cIndex) => (
                                <div key={cIndex} className={styles.categoria}>
                                    <input
                                        placeholder="Nome da categoria"
                                        value={cat.nome}
                                        onChange={(e) => alterarNomeCategoria(cIndex, e.target.value)}
                                    />
                                    {cat.pizzas.map((pizza, pIndex) => (
                                        <div key={pIndex} className={styles.pizza}>
                                            <input
                                                placeholder="Nome da pizza"
                                                value={pizza.nome}
                                                onChange={(e) =>
                                                    alterarPizza(cIndex, pIndex, "nome", e.target.value)
                                                }
                                            />
                                            <input
                                                placeholder="Preço pequena"
                                                type="number"
                                                value={pizza.precoPequena}
                                                onChange={(e) =>
                                                    alterarPizza(cIndex, pIndex, "precoPequena", Number(e.target.value))
                                                }
                                            />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => adicionarPizza(cIndex)}>
                                        Adicionar Pizza
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={adicionarCategoria}>
                                Adicionar Categoria
                            </button>
                            <button type="submit" disabled={loading}>
                                {loading ? "Enviando..." : "Salvar Cardápio"}
                            </button>
                        </form>
                    </div>
                </div>
            ) : (<button onClick={abrirModal}>Adicionar Cardápio</button>)}
        </>
    );
}
