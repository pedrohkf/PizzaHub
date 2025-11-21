'use client';
import Button from "@/app/Components/Forms/button";
import register from "@/app/actions/register";
import { useFormStatus } from "react-dom";
import styles from "./register-form.module.css"
import { redirect } from "next/navigation";
import { useState } from "react";

function FormButton() {
    const { pending } = useFormStatus();

    return (
        <div className={styles.buttons}>
            <Button type="submit" disabled={pending}>
                {pending ? "Enviando..." : "Cadastrar"}
            </Button>
        </div>
    );
}


export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const [error, setError] = useState<string>();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // impede reload da página
        setError(undefined);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        if (!email) {
            setError('O campo email é obrigatório.');
            return;
        }

        if (!password) {
            setError('O campo senha é obrigatório.');
            return;
        }

        const result = await register(formData);

        if (!result.success) {
            setError(result.message);
            setTimeout(() => setError(""), 7000);
            return;
        }

        onSwitch();
    };


    return (
        <form className={styles.formRegister} onSubmit={handleSubmit}>
            <div className={styles.title}>
                <h2>Seja bem vindo!</h2>
            </div>

            <div className={styles.selection}>
                <button type="button" onClick={onSwitch}>Entrar</button>
                <button type="submit" className={styles.btnActived}>Cadastrar</button>
            </div>


            <div className={styles.inputs}>
                <div><p>Email</p><input type="email" name="email" placeholder="Insira seu email" /></div>
                <div><p>Senha</p><input type="password" name="password" placeholder="Insira sua senha" /></div>
                <p className={styles.errorMessage}>{error}</p>
            </div>

            <FormButton />
        </form>
    )
}