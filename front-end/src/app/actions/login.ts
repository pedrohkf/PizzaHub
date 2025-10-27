'use server';
import axios from "axios";

export default async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email) return { success: false, message: "O campo email é obrigatório." };
  if (!password) return { success: false, message: "O campo senha é obrigatório." };

  try {
    const response = await axios.post("https://pizza-hub-lime.vercel.app/auth/login", { email, password });
    const data = response.data;

    return {
      success: true,
      data: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        token: data.token,
      },
    };
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return { success: false, message: error.response.data.message || "Erro ao fazer login." };
    }
    return { success: false, message: "Erro inesperado. Tente novamente mais tarde." };
  }
}
