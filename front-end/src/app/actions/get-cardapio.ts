"use server";

import axios from "axios";

export async function getCardapio(pizzariaId: string) {
  const response = await axios.get(
    `https://pizza-hub-lime.vercel.app/api/cardapios/get/${pizzariaId}`
  );
  return response.data;
}
