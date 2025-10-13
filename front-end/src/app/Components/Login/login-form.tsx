'use client';
import login from "@/app/actions/login";
import Button from "@/app/Components/Forms/button";
import styles from "./login-form.module.css"
import { useFormStatus } from "react-dom";
import { redirect } from "next/navigation";
import { useState } from "react";

function FormButton() {
    const { pending } = useFormStatus();

    return (
        <div className={styles.buttons}>
            {pending ? (
                <Button disabled={pending}>Entrando...</Button>
            ) : (
                <Button onClick={() => redirect('pizzahub/dashboard')}>Entrar</Button>
            )}
        </div>
    );
}

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const [error, setError] = useState<string>();

    const handleSubmit = async (formData: FormData) => {
        setError(undefined);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const result = await login(formData);

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
            setTimeout(() => setError(""), 5000); 
            return;
        }

        await login(formData);

        redirect('pizzahub/dashboard')
    }

    return (
        <form className={styles.formLogin} action={handleSubmit}>
            <div className={styles.title}>
                <h2>Que bom ver você de novo!</h2>
            </div>

            <div className={styles.selection}>
                <button className={styles.btnActived}>Entrar</button>
                <button onClick={onSwitch}>Cadastrar</button>
            </div>
            <div className={styles.inputs}>
                <div>
                    <p>Email</p>
                    <input type="email" name="email" placeholder="Insira seu email" required
                    />
                </div>
                <div>
                    <p>Senha</p>
                    <input type="password" name="password" placeholder="Insira sua senha" required
                    />
                </div>
                <p className={styles.errorMessage}>{error}</p>
            </div>

            <FormButton />
        </form>
    )
}