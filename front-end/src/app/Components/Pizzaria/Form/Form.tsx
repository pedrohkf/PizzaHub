"use client";
import { useState } from "react";
import { PizzariaFormData } from "@/types/pizzaria";
import { postPizzaria } from "../../../actions/post-pizzaria";

export default function PizzariaForm() {
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
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await postPizzaria(formData);
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
      });
    } catch (error: any) {
      alert(error.message || "Erro ao criar pizzaria.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto p-4 border rounded-lg shadow-md"
    >
      <input
        type="text"
        name="name"
        placeholder="Nome da pizzaria"
        value={formData.name}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="phone"
        placeholder="Telefone"
        value={formData.phone}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        name="openingHours"
        placeholder="Horário de funcionamento"
        value={formData.openingHours}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        name="numberHouse"
        placeholder="Número"
        value={formData.numberHouse}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        name="street"
        placeholder="Rua"
        value={formData.street}
        onChange={handleChange}
        className="p-2 border rounded"
      />
      <input
        type="text"
        name="neighborhood"
        placeholder="Bairro"
        value={formData.neighborhood}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        name="state"
        placeholder="Estado"
        value={formData.state}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <input
        type="text"
        name="deliveryFee"
        placeholder="Taxa de entrega"
        value={formData.deliveryFee}
        onChange={handleChange}
        className="p-2 border rounded"
        required
      />
      <select
        name="methodPay"
        value={formData.methodPay}
        onChange={handleChange}
        className="p-2 border rounded"
      >
        <option value="dinheiro">Dinheiro</option>
        <option value="pix">Pix</option>
        <option value="cartão">Cartão</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className={`bg-black text-white py-2 rounded transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
        }`}
      >
        {loading ? "Enviando..." : "Cadastrar Pizzaria"}
      </button>
    </form>
  );
}
