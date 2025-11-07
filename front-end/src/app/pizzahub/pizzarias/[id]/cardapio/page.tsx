"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./cardapio.module.css";
import { useAuth } from "@/context/AuthContext";
import Carrinho from "../../../../Components/Carrinho/Carrinho"

import { Pizza } from "@/types/Pizza";

type FormaPagamento = "Pix" | "Cartão" | "Dinheiro";



interface Categoria {
    nome: string;
    pizzas: Pizza[];
}

interface Cardapio {
    _id: string;
    categorias: Categoria[];
    userId: string;
}

export default function CardapiosPage() {
    const params = useParams();
    const id = params?.id;
    const { user } = useAuth();
    const router = useRouter();

    const [userCardapios, setUserCardapios] = useState<Cardapio[]>([]);
    const [selectedCardapios, setSelectedCardapios] = useState<string[]>([]);

    const [cart, setCart] = useState<Pizza[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Estados do formulário de finalização
    const [nomeCliente, setNomeCliente] = useState("");
    const [endereco, setEndereco] = useState("");
    const [telefone, setTelefone] = useState("");
    const [cpf, setCpf] = useState("");
    const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("Pix");


    // Carregar carrinho do localStorage
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(savedCart);
    }, []);

    // Atualizar localStorage quando carrinho mudar
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    // Adicionar pizza ao carrinho
    function addToCart(pizza: Pizza) {
        setCart(prev => [...prev, pizza]);
        alert(`${pizza.nome} foi adicionado ao carrinho!`);
    }

    // Buscar dados da pizzaria
    useEffect(() => {
        if (!id) return;
        async function fetchPizzaria() {
            const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/get/${id}`);
            const data = await res.json();
            setSelectedCardapios(data.cardapio || []);
        }
        fetchPizzaria();
    }, [id]);

    // Buscar todos os cardápios do usuário
    useEffect(() => {
        async function fetchUserCardapios() {
            if (!user?.id) return;
            const res = await fetch(`https://pizza-hub-lime.vercel.app/api/cardapio/${user.id}`);
            const data = await res.json();
            if (Array.isArray(data)) setUserCardapios(data);
        }
        fetchUserCardapios();
    }, [user?.id]);

    // Finalizar pedido e salvar no localStorage
    async function handleConfirmOrder() {
        // 1️⃣ Verificar se todos os campos estão preenchidos
        if (!nomeCliente || !endereco || !telefone || !cpf) {
            alert("Preencha todos os campos!");
            return;
        }

        // 2️⃣ Agrupar pizzas iguais do carrinho
        const groupedItems: { [key: string]: number } = {};
        cart.forEach(pizza => {
            if (groupedItems[pizza._id]) {
                groupedItems[pizza._id] += 1;
            } else {
                groupedItems[pizza._id] = 1;
            }
        });

        // Transformar objeto em array de itens
        const itens = Object.entries(groupedItems).map(([pizzaID, quantidade]) => {
            const pizza = cart.find(p => p._id === pizzaID);
            return {
                pizzaID,
                nome: pizza?.nome,
                preco: pizza?.precoMedia,
                quantidade
            };
        });


        // 3️⃣ Calcular o total do pedido
        const total = cart.reduce((sum, pizza) => sum + pizza.precoMedia, 0);

        // 4️⃣ Montar o objeto do pedido
        const pedido = {
            cliente: { nome: nomeCliente, endereco, telefone, cpf, formaPagamento },
            itens: itens,
            total,
            pizzariaId: id,
        };

        console.log(pedido)

        try {
            const res = await fetch("https://pizza-hub-lime.vercel.app/api/pedidos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pedido)
            });

            if (!res.ok) throw new Error("Erro ao criar pedido");

            alert("Pedido finalizado com sucesso!");

            // 6️⃣ Limpar carrinho e modal
            setCart([]);
            setIsModalOpen(false);

            // 7️⃣ Resetar formulário
            setNomeCliente("");
            setEndereco("");
            setTelefone("");
            setCpf("");
            setFormaPagamento("Pix");

            // 8️⃣ Salvar localmente também (opcional)
            const pedidosSalvos = JSON.parse(localStorage.getItem("pedidos") || "[]");
            pedidosSalvos.push(pedido);
            localStorage.setItem("pedidos", JSON.stringify(pedidosSalvos));

            router.push("agradecimento");
        } catch (err) {
            console.error(err);
            alert("Erro ao enviar pedido. Tente novamente.");
        }
    }

    useEffect(() => {
        if (isModalOpen) {
            const pedidosSalvos = JSON.parse(localStorage.getItem("pedidos") || "[]");
            if (pedidosSalvos.length > 0) {
                const ultimoPedido = pedidosSalvos[pedidosSalvos.length - 1];
                if (ultimoPedido?.cliente) {
                    setNomeCliente(ultimoPedido.cliente.nome || "");
                    setEndereco(ultimoPedido.cliente.endereco || "");
                    setTelefone(ultimoPedido.cliente.telefone || "");
                    setCpf(ultimoPedido.cliente.cpf || "");
                    setFormaPagamento(ultimoPedido.cliente.formaPagamento || "pix");
                }
            }
        }
    }, [isModalOpen]);


    if (!selectedCardapios) return <p>Carregando...</p>;

    return (
        <div className={styles.editorPage}>
            <section id="cardapio" className={styles.cardapioPreview}>
                <h2>Cardápios</h2>

                <Carrinho cart={cart} setCart={setCart} />


                {/* Cardápios */}
                {userCardapios
                    .filter(c => selectedCardapios.includes(c._id))
                    .map(cardapio =>
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
                                                <button className={styles.buyBtn} onClick={() => addToCart(pizza)}>Comprar</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                <button className={styles.finalizeBtn} onClick={() => setIsModalOpen(true)}>
                    Finalizar Pedido
                </button>
            </section>

            {/* Modal de finalização */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h2>Finalize seu pedido</h2>

                        <label>Nome:</label>
                        <input value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} />

                        <label>Endereço:</label>
                        <input value={endereco} onChange={e => setEndereco(e.target.value)} />

                        <label>Telefone:</label>
                        <input value={telefone} onChange={e => setTelefone(e.target.value)} />

                        <label>CPF:</label>
                        <input value={cpf} onChange={e => setCpf(e.target.value)} />

                        <label>Forma de Pagamento:</label>
                        <select
                            value={formaPagamento}
                            onChange={e => setFormaPagamento(e.target.value as FormaPagamento)}
                        >
                            <option value="Pix">Pix</option>
                            <option value="Cartão">Cartão</option>
                            <option value="Dinheiro">Dinheiro</option>
                        </select>


                        <button onClick={handleConfirmOrder}>Confirmar Pedido</button>
                        <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                    </div>
                </div>
            )}
        </div>
    );
}
