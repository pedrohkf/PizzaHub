"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

import styles from "./DashboardChart.module.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface Pedido {
    total: number;
    createdAt: string;
}

interface Props {
    pizzariaId: string;
}

export default function DashboardChart({ pizzariaId }: Props) {
    const [dados, setDados] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        async function carregar() {
            const res = await fetch(
                `https://pizza-hub-lime.vercel.app/api/pedidos/pizzaria/${pizzariaId}`
            );
            const pedidos: Pedido[] = await res.json();

            const hoje = new Date();
            const faturamentoMensal = Array(12).fill(0);
            const mesesLabels = [];

            for (let i = 11; i >= 0; i--) {
                const date = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
                mesesLabels.push(
                    date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase()
                );
            }

            pedidos.forEach((pedido) => {
                const dataPedido = new Date(pedido.createdAt);
                const diffMeses =
                    (hoje.getFullYear() - dataPedido.getFullYear()) * 12 +
                    (hoje.getMonth() - dataPedido.getMonth());

                if (diffMeses >= 0 && diffMeses < 12) {
                    faturamentoMensal[11 - diffMeses] += pedido.total;
                }
            });

            setDados(faturamentoMensal);
            setLabels(mesesLabels);
        }

        carregar();
    }, [pizzariaId]);

    const data = {
        labels,
        datasets: [
            {
                label: "Faturamento (R$)",
                data: dados,
                borderColor: "var(--accent-1)",
                backgroundColor: "rgba(255, 122, 0, 0.25)",
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 5,
                pointBackgroundColor: "var(--accent-2)",
                pointBorderColor: "white",
                pointBorderWidth: 2,
                maintainAspectRatio: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "var(--bg-1)",
                    font: { size: 14, weight: "600" },
                },
            },
        },
        scales: {
            x: {
                ticks: { color: "var(--bg-1)" },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "var(--bg-1)",
                    callback: (value: number) => `R$ ${value}`,
                },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
        },
    };
    

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Faturamento - Últimos 12 meses</h2>
    
            <div className={styles.chartWrapper}>
                <Line data={data} options={options} />
            </div>
        </div>
    );
    
}
