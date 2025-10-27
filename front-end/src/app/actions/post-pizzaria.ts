import axios from "axios";
import { PizzariaFormData } from "@/types/pizzaria";

export async function postPizzaria(data: PizzariaFormData, userId: string) {
  try {
    const payload = { ...data, userId };

    const response = await axios.post(
      "https://pizza-hub-lime.vercel.app/api/pizzarias/create",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro em postPizzaria:",
      error.response?.data?.message || error.message
    );
    throw new Error(error.response?.data?.message || "Falha na requisição.");
  }
}
