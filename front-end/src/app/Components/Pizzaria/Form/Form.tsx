"use client";
import { useState } from "react";
import { PizzariaFormData } from "@/types/pizzaria";
import { postPizzaria } from "@/app/actions/post-pizzaria";
import { useAuth } from "@/context/AuthContext";

import { useRouter } from "next/navigation";

import styles from "./Pizzaria-form.module.css";


interface PizzariaFormProps {
  onClose?: () => void;
}

export default function PizzariaForm({ onClose }: PizzariaFormProps) {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<PizzariaFormData>({
    name: "",
    phone: "",
    openingHours: "",
    numberHouse: "",
    street: "",
    neighborhood: "",
    state: "",
    deliveryFee: "",
    methodPay: "dinheiro",
    userId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      alert("Você precisa estar logado!");
      return;
    }

    setLoading(true);
    try {
      await postPizzaria(formData, user.id);
      alert("Pizzaria criada com sucesso!");
      setFormData({
        name: "",
        phone: "",
        openingHours: "",
        numberHouse: "",
        street: "",
        neighborhood: "",
        state: "",
        deliveryFee: "",
        methodPay: "dinheiro",
        userId: "",
      });

      router.push("/pizzahub/pizzarias")
    } catch (error: unknown) {
      console.error(error || "Erro ao criar pizzaria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.close}>
        {onClose && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => router.push("/pizzahub/pizzarias")}
            aria-label="Fechar"
          >
            ×
          </button>
        )}
      </div>
      <h2>Cadastro da Pizzaria</h2>
      <small>Preencha as informações abaixo</small>

      <input
        className={styles.input}
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome da pizzaria"
        required
      />
      <input
        className={styles.input}
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        placeholder="Telefone"
        required
      />
      <input
        className={styles.input}
        name="openingHours"
        value={formData.openingHours}
        onChange={handleChange}
        placeholder="Horário de funcionamento"
        required
      />
      <input
        className={styles.input}
        name="numberHouse"
        value={formData.numberHouse}
        onChange={handleChange}
        placeholder="Número"
        required
      />
      <input
        className={styles.input}
        name="street"
        value={formData.street}
        onChange={handleChange}
        placeholder="Rua"
      />
      <input
        className={styles.input}
        name="neighborhood"
        value={formData.neighborhood}
        onChange={handleChange}
        placeholder="Bairro"
        required
      />
      <input
        className={styles.input}
        name="state"
        value={formData.state}
        onChange={handleChange}
        placeholder="Estado"
        required
      />
      <input
        className={styles.input}
        name="deliveryFee"
        value={formData.deliveryFee}
        onChange={handleChange}
        placeholder="Taxa de entrega"
        required
      />
      <select
        className={styles.input}
        name="methodPay"
        value={formData.methodPay}
        onChange={handleChange}
      >
        <option value="dinheiro">Dinheiro</option>
        <option value="pix">Pix</option>
        <option value="cartão">Cartão</option>
      </select>

      <button
        className={styles.submitButton}
        type="submit"
        disabled={loading}
      >
        {loading ? "Enviando..." : "Cadastrar Pizzaria"}
      </button>
    </form>
  );
}
