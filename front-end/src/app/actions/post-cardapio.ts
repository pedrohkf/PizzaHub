import axios from "axios";

export async function postCardapio(data: any, userId: string) {
  const payload = { ...data, userId };

  const response = await axios.post(
    "https://pizza-hub-lime.vercel.app/api/cardapio",
    payload,
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data;
}
