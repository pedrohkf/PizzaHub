import axios from "axios";
import { CardapioFormData } from "@/types/Cardapio";

export async function postCardapio(data: CardapioFormData, userId: string) {
  try {
    const payload = { ...data, userId };

    const response = await axios.post(
      "https://pizza-hub-lime.vercel.app/api/cardapio",
      payload,
      {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      }
    );

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error("Erro em postCardapio:", message);
      throw new Error(message);
    }

    console.error("Erro inesperado em postCardapio:", error);
    throw new Error("Falha na requisição.");
  }
}
