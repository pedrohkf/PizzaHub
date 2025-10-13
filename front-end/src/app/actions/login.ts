'use server';
import axios from "axios";
import { cookies } from "next/headers";

export default async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email) {
        return { success: false, message: 'O campo email é obrigatório.' }
    }

    if (!password) {
        return { success: false, message: 'O campo email é obrigatório.' }

    }

    try {
        const response = await axios.post(`https://pizza-hub-lime.vercel.app/auth/login`, {
            email,
            password
        });

        const data = await response.data;
        const cookieStore = await cookies()

        cookieStore.set('token', data.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24
        });

        return { success: true, data: response.data };

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            return {
                success: false,
                message: error.response.data.message || 'Erro ao fazer login.',
            }
        }

        return {
            success: false,
            message: 'Erro inesperado. Tente novamente mais tarde.',
        }
    }




}