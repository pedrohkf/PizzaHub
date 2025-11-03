"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./cardapio.module.css";
import CardapioForm from "@/app/Components/Pizzaria/Cardapio-Form/cardapio";
import { useAuth } from "@/context/AuthContext";

// Tipos
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
    _id: string;
    categorias: Categoria[];
    userId: string;
}

interface Pizzaria {
    name: string;
    phone: string;
    openingHours: string;
    numberHouse: string;
    street: string;
    neighborhood: string;
    state: string;
    deliveryFee: string;
    methodPay: "dinheiro" | "pix" | "cartão";
    logo: string;
    bannerImage: string;
    gallery: string[];
    slogan: string;
    description: string;
    socialLinks: {
        instagram: string;
        whatsapp: string;
        website: string;
    };
    cardapioSelecionado?: string[]; // _id do cardápio selecionado
}

export default function CardapioPage() {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const { user } = useAuth();

    // Estados principais
    const [pizzaria, setPizzaria] = useState<Pizzaria | null>(null);

    const [userCardapios, setUserCardapios] = useState<Cardapio[]>([]);
    const [selectedCardapios, setSelectedCardapios] = useState<string[]>([]);


    // Buscar dados da pizzaria
    useEffect(() => {
        if (!id) return;
        async function fetchPizzaria() {
            const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/get/${id}`);
            const data = await res.json();

            console.log("Pizzaria carregada do backend:", data);

            setPizzaria(data);
            setSelectedCardapios(data.cardapio || null);
        }
        fetchPizzaria();
    }, [id]);


    // Buscar todos os cardápios do usuário
    useEffect(() => {
        async function fetchUserCardapios() {
            if (!user?.id) return;
            console.log("Buscando cardápios do usuário com ID:", user.id);

            const res = await fetch(`https://pizza-hub-lime.vercel.app/api/cardapio/${user.id}`);
            const data = await res.json();

            console.log("Resposta do backend:", data);

            if (Array.isArray(data)) {
                console.log("Cardápios recebidos:", data.map(c => c._id));
                setUserCardapios(data);
            } else {
                setUserCardapios([]);
            }
        }
        fetchUserCardapios();
    }, [user?.id]);


    // Função para salvar alterações
    async function handleSave() {
        console.log("Selected Cardápio ID ao salvar:", selectedCardapios);
        if (!pizzaria) return;

        const updated = {
            ...pizzaria,
            cardapio: selectedCardapios, // envia o _id do cardápio
        };

        try {
            const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/update/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });

            if (res.ok) {
                alert("Pizzaria atualizada com sucesso!");
                router.refresh();
            } else {
                const errText = await res.text();
                console.error("Erro no backend:", errText);
                alert("Erro ao salvar. Verifique o console.");
            }
        } catch (err) {
            console.error("Erro ao atualizar pizzaria:", err);
            alert("Erro de conexão ao salvar.");
        }
    }

    if (!pizzaria) return <p>Carregando...</p>;

    return (
        <div className={styles.editorPage}>
            <section id="cardapio" className={styles.cardapioPreview}>
                <h2>Cardápios Selecionados</h2>
                {userCardapios
                    .filter(c => selectedCardapios.includes(c._id))
                    .map((cardapio) =>
                        cardapio.categorias.map((cat, index) => (
                            <div key={cardapio._id + index} className={styles.categoryCard}>
                                <h3>{cat.nome}</h3>
                                <div className={styles.pizzasGrid}>
                                    {cat.pizzas.map((pizza, i) => (
                                        <div key={i} className={styles.pizzaCard}>
                                            <h4>{pizza.nome}</h4>
                                            <p>{pizza.descricao}</p>
                                            <div className={styles.priceAndBuy}>
                                                <span>Média: R$ {pizza.precoMedia.toFixed(2)}</span>
                                                <button className={styles.buyBtn} onClick={() => router.push(`/pizzarias/${id}/cardapio`)}>Comprar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
            </section>
        </div >
    );
}
