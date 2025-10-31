"use client";

import { useState, useEffect } from "react";
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
    _id?: string;
    nome?: string;
    categorias: Categoria[];
}

interface CardapioFormProps {
    pizzariaId?: string; // opcional, caso queira vincular o cardápio
    onCardapioCreated?: (cardapio: Cardapio) => void; // callback para avisar EditPage
}

export default function CardapioForm({ pizzariaId, onCardapioCreated }: CardapioFormProps) {
    const [cardapio, setCardapio] = useState<Cardapio>({ categorias: [] });
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useAuth();

    const abrirModal = () => setIsOpen(true);
    const fecharModal = () => setIsOpen(false);

    function adicionarCategoria() {
        setCardapio(prev => ({
            categorias: [...prev.categorias, { nome: "", pizzas: [] }]
        }));
    }

    function alterarNomeCategoria(index: number, nome: string) {
        const novasCategorias = [...cardapio.categorias];
        novasCategorias[index] = { ...novasCategorias[index], nome };
        setCardapio({ categorias: novasCategorias });
    }

    function adicionarPizza(cIndex: number) {
        const novasCategorias = [...cardapio.categorias];
        novasCategorias[cIndex] = {
            ...novasCategorias[cIndex],
            pizzas: [
                ...novasCategorias[cIndex].pizzas,
                {
                    nome: "",
                    descricao: "",
                    precoPequena: 0,
                    precoMedia: 0,
                    precoGrande: 0,
                    imagem: "",
                    destaque: false,
                    disponivel: true
                }
            ]
        };
        setCardapio({ categorias: novasCategorias });
    }

    function alterarPizza<K extends keyof Pizza>(cIndex: number, pIndex: number, campo: K, valor: Pizza[K]) {
        const novasCategorias = [...cardapio.categorias];
        const pizza = { ...novasCategorias[cIndex].pizzas[pIndex] };
        pizza[campo] = valor;
        novasCategorias[cIndex].pizzas[pIndex] = pizza;
        setCardapio({ categorias: novasCategorias });
    }

    function removerPizza(cIndex: number, pIndex: number) {
        const novasCategorias = [...cardapio.categorias];
        novasCategorias[cIndex] = {
            ...novasCategorias[cIndex],
            pizzas: novasCategorias[cIndex].pizzas.filter((_, i) => i !== pIndex)
        };
        setCardapio({ categorias: novasCategorias });
    }

    function removerCategoria(cIndex: number) {
        setCardapio(prev => ({
            categorias: prev.categorias.filter((_, i) => i !== cIndex)
        }));
    }

    function normalizeCardapio(input: Cardapio): Cardapio {
        return {
            ...input,
            categorias: input.categorias.map(cat => ({
                ...cat,
                pizzas: cat.pizzas.map(p => ({
                    ...p,
                    precoPequena: Number(p.precoPequena) || 0,
                    precoMedia: Number(p.precoMedia) || 0,
                    precoGrande: Number(p.precoGrande) || 0
                }))
            }))
        };
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!user || !user.id) {
            alert("Usuário não encontrado. Faça login novamente.");
            return;
        }

        setLoading(true);
        try {
            const payload = normalizeCardapio(cardapio);
            const createdCardapio = await postCardapio(payload, user.id);

            alert("Cardápio criado com sucesso!");
            setCardapio({ categorias: [] });
            fecharModal();

            // callback para EditPage atualizar lista
            if (onCardapioCreated) onCardapioCreated(createdCardapio);
        } catch (error) {
            console.error(error);
            alert("Erro ao criar cardápio!");
        } finally {
            setLoading(false);
        }
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
                                    <div className={styles.categoriaHeader}>
                                        <input
                                            placeholder="Nome da categoria"
                                            value={cat.nome}
                                            onChange={(e) => alterarNomeCategoria(cIndex, e.target.value)}
                                        />
                                        <button type="button" onClick={() => removerCategoria(cIndex)}>Remover Categoria</button>
                                    </div>
                                    {cat.pizzas.map((pizza, pIndex) => (
                                        <div key={pIndex} className={styles.pizza}>
                                            <input
                                                placeholder="Nome da pizza"
                                                value={pizza.nome}
                                                onChange={(e) => alterarPizza(cIndex, pIndex, "nome", e.target.value)}
                                            />
                                            <input
                                                placeholder="Preço pequena"
                                                type="number"
                                                step="0.01"
                                                value={pizza.precoPequena}
                                                onChange={(e) => alterarPizza(cIndex, pIndex, "precoPequena", Number(e.target.value))}
                                            />
                                            <input
                                                placeholder="Preço média"
                                                type="number"
                                                step="0.01"
                                                value={pizza.precoMedia}
                                                onChange={(e) => alterarPizza(cIndex, pIndex, "precoMedia", Number(e.target.value))}
                                            />
                                            <input
                                                placeholder="Preço grande"
                                                type="number"
                                                step="0.01"
                                                value={pizza.precoGrande}
                                                onChange={(e) => alterarPizza(cIndex, pIndex, "precoGrande", Number(e.target.value))}
                                            />
                                            <textarea
                                                placeholder="Descrição"
                                                value={pizza.descricao}
                                                onChange={(e) => alterarPizza(cIndex, pIndex, "descricao", e.target.value)}
                                            />
                                            <input
                                                placeholder="URL da imagem"
                                                value={pizza.imagem}
                                                onChange={(e) => alterarPizza(cIndex, pIndex, "imagem", e.target.value)}
                                            />
                                            <label>
                                                Destaque
                                                <input
                                                    type="checkbox"
                                                    checked={pizza.destaque}
                                                    onChange={(e) => alterarPizza(cIndex, pIndex, "destaque", e.target.checked)}
                                                />
                                            </label>
                                            <label>
                                                Disponível
                                                <input
                                                    type="checkbox"
                                                    checked={pizza.disponivel}
                                                    onChange={(e) => alterarPizza(cIndex, pIndex, "disponivel", e.target.checked)}
                                                />
                                            </label>
                                            <button type="button" onClick={() => removerPizza(cIndex, pIndex)}>Remover Pizza</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => adicionarPizza(cIndex)}>Adicionar Pizza</button>
                                </div>
                            ))}
                            <div className={styles.actions}>
                                <button type="button" onClick={adicionarCategoria}>Adicionar Categoria</button>
                                <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Salvar Cardápio"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : (
                <button onClick={abrirModal} className={styles.openButton}>Adicionar Cardápio</button>
            )}
        </>
    );
}
