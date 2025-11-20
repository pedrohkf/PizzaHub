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

export default function DashboardOrdersChart({ pizzariaId }: Props) {
    const [dados, setDados] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);
    const [intervalo, setIntervalo] = useState(12);



    useEffect(() => {
        async function carregar() {
            const res = await fetch(
                `https://pizza-hub-lime.vercel.app/api/pedidos/pizzaria/${pizzariaId}`
            );
            const pedidos: Pedido[] = await res.json();

            if (intervalo === 1) {
                const hoje = new Date();

                const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
                const diasLabels = Array.from({ length: ultimoDia }, (_, i) => (i + 1).toString());
                const faturamentoDiario = Array(ultimoDia).fill(0);

                pedidos.forEach((pedido) => {
                    const data = new Date(pedido.createdAt);

                    const mesmoMes =
                        data.getMonth() === hoje.getMonth() &&
                        data.getFullYear() === hoje.getFullYear();

                    if (mesmoMes) {
                        const dia = data.getDate();
                        faturamentoDiario[dia - 1] += 1;

                    }
                });

                setLabels(diasLabels);
                setDados(faturamentoDiario);
                return;
            }


            const hoje = new Date();
            const faturamentoMensal = Array(intervalo).fill(0);
            const mesesLabels = [];

            for (let i = intervalo - 1; i >= 0; i--) {
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

                if (diffMeses >= 0 && diffMeses < intervalo) {
                    faturamentoMensal[intervalo - 1 - diffMeses] += 1;
                }

            });

            setDados(faturamentoMensal);
            setLabels(mesesLabels);
        }

        carregar();
    }, [pizzariaId, intervalo]);

    const data = {
        labels,
        datasets: [
            {
                label: "Quantidade de pedidos",
                data: dados,
                borderColor: "var(--accent-3)",
                backgroundColor: "rgba(0, 122, 255, 0.25)",
                borderWidth: 3,
                tension: 0.35,
                pointRadius: 5,
            }
        ]
    };


    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: "var(--bg-1)",
                    font: { size: 14, weight: 600 }, // sem aspas
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
                    callback: (tickValue: string | number) => `R$ ${Number(tickValue)}`,
                },
                grid: { color: "rgba(0,0,0,0.05)" },
            },
        },

    };

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>Pedidos - Últimos {intervalo} meses</h2>
            <div className={styles.filtros}>
                <button
                    className={`${styles.filtro} ${intervalo === 1 ? styles.ativo : ""}`}
                    onClick={() => setIntervalo(1)}
                >
                    Último mês
                </button>

                <button
                    className={`${styles.filtro} ${intervalo === 6 ? styles.ativo : ""}`}
                    onClick={() => setIntervalo(6)}
                >
                    Ultimos 6 meses
                </button>
                <button
                    className={`${styles.filtro} ${intervalo === 12 ? styles.ativo : ""}`}
                    onClick={() => setIntervalo(12)}
                >
                    Últimos 12 meses
                </button>
            </div>


            <div className={styles.chartWrapper}>
                <Line data={data} options={options} />
            </div>
        </div>
    );

}
