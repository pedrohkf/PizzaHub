"use server";
import axios from "axios";

export async function getPizzariaById(id: string) {
  try {
    const response = await axios.get(
      `https://pizza-hub-lime.vercel.app/api/pizzarias/get/${id}`
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pizzaria específica:", error);
    return null;
  }
}
