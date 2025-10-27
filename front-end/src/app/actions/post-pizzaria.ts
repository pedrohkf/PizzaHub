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
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message;
      console.error("Erro em postPizzaria:", message);
      throw new Error(message);
    }

    console.error("Erro inesperado em postPizzaria:", error);
    throw new Error("Falha na requisição.");
  }
}
