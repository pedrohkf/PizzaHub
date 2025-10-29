"use server";

import axios from "axios";

export async function getPizzarias() {
  try {
    const response = await axios.get(`https://pizza-hub-lime.vercel.app/api/pizzarias/get`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pizzarias:", error);
    return [];
  }
}
