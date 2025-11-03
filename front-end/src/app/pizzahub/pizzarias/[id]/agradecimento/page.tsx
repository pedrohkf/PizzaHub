"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Agradecimento.module.css";

interface Pedido {
    cliente: {
        nome: string;
    };
    itens: {
        pizzaId: string;
        nome: string;
        quantidade: number;
        preco: number;
    }[];
    total: number;
}

export default function Agradecimento() {
    const router = useRouter();
    const [pedido, setPedido] = useState<Pedido | null>(null);
    
    useEffect(() => {
        const savedPedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
        if (savedPedidos.length > 0) {
            setPedido(savedPedidos[savedPedidos.length - 1]);
        }
    }, []);

    function handleBackToMenu() {
        router.push("./");
    }

    if (!pedido) {
        return <p>Carregando...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1>Obrigado pela sua compra, {pedido.cliente.nome}!</h1>
                <p>Seu pedido foi registrado com sucesso 🍕</p>

                <button className={styles.backBtn} onClick={handleBackToMenu}>
                    Voltar ao cardápio
                </button>
            </div>
        </div>
    );
}
