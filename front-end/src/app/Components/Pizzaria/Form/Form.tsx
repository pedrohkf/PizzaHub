"use client";
import { useState } from "react";
import { PizzariaFormData } from "@/types/pizzaria";
import { postPizzaria } from "@/app/actions/post-pizzaria";
import { useAuth } from "@/context/AuthContext";

export default function PizzariaForm() {
  const { user } = useAuth();

  const [formData, setFormData] = useState<PizzariaFormData>({
    name: "", phone: "", openingHours: "", numberHouse: "", street: "",
    neighborhood: "", state: "", deliveryFee: "", methodPay: "dinheiro", userId: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) { alert("Você precisa estar logado!"); return; }

    setLoading(true);
    try {
      await postPizzaria(formData, user.id);
      alert("Pizzaria criada com sucesso!");
      setFormData({ name: "", phone: "", openingHours: "", numberHouse: "", street: "", neighborhood: "", state: "", deliveryFee: "", methodPay: "dinheiro", userId: "" });
    } catch (error: any) {
      alert(error.message || "Erro ao criar pizzaria.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} placeholder="Nome da pizzaria" />
      <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefone" required />
      <input name="openingHours" value={formData.openingHours} onChange={handleChange} placeholder="Horário" required />
      <input name="numberHouse" value={formData.numberHouse} onChange={handleChange} placeholder="Número" required />
      <input name="street" value={formData.street} onChange={handleChange} placeholder="Rua" />
      <input name="neighborhood" value={formData.neighborhood} onChange={handleChange} placeholder="Bairro" required />
      <input name="state" value={formData.state} onChange={handleChange} placeholder="Estado" required />
      <input name="deliveryFee" value={formData.deliveryFee} onChange={handleChange} placeholder="Taxa de entrega" required />
      <select name="methodPay" value={formData.methodPay} onChange={handleChange}>
        <option value="dinheiro">Dinheiro</option>
        <option value="pix">Pix</option>
        <option value="cartão">Cartão</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Cadastrar Pizzaria"}</button>
    </form>
  );
}
