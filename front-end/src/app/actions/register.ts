"use server";
import axios from "axios";

export default async function register(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;


    if (!email) {
        return { success: false, message: 'O campo email é obrigatório.' }
    }

    if (!password) {
        return { success: false, message: 'O campo email é obrigatório.' }
    }

    try {
        const response = await axios.post(`https://pizza-hub-lime.vercel.app/auth/register`, {
            email,
            password
        })

        const data = response.data;

        return data;

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data.message || 'Erro ao fazer cadastro.',
            }
        }

        return {
            success: false,
            message: 'Erro inesperado. Tente novamente mais tarde.',
        }
    }
}