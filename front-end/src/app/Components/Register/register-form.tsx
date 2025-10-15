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
            {pending ? (
                <Button disabled={pending}>Enviando...</Button>
            ) : (
                <Button onClick={() => redirect('pizzahub/dashboard')}>Cadastrar</Button>
            )}
        </div>
    );
}

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const [error, setError] = useState<string>();

    const handleSubmit = async (formData: FormData) => {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const result = await register(formData);


        if (!email) {
            setError('O campo email é obrigatório.');
            return
        }

        if (!password) {
            setError('O campo senha é obrigatório.');
            return
        }

        if (!result.success) {
            setError(result.message);
            setTimeout(() => setError(""), 7000); 
            return;
        }

        await register(formData);

        redirect('pizzahub/dashboard')
    }

    return (
        <form className={styles.formRegister} action={handleSubmit}>
            <div className={styles.title}>
                <h2>Seja bem vindo!</h2>
            </div>

            <div className={styles.selection}>
                <button onClick={onSwitch}>Entrar</button>
                <button className={styles.btnActived}>Cadastrar</button>
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