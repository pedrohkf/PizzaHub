'use client';
import { useState } from "react";
import loginAction from "@/app/actions/login";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Button from "@/app/Components/Forms/button";

import styles from "./login-form.module.css";
import { useFormStatus } from "react-dom";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login: setUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();

  function FormButton() {
    const { pending } = useFormStatus();

    return (
      <div className={styles.buttons}>
        {pending ? (
          <Button disabled>Enviando...</Button>
        ) : (
          <Button type="submit">Login</Button>
        )}
      </div>
    );
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (!result.success || !result.data) {
      setError(result.message || "Erro ao fazer login");
      return;
    }

    setUser(result.data);
    router.push("/pizzahub/dashboard");
  };

  return (
    <form className={styles.formLogin} onSubmit={handleSubmit}>
      <div className={styles.title}>
        <h2>Seja bem-vindo de volta!</h2>
      </div>

      <div className={styles.selection}>
        <button type="submit" className={styles.btnActived}>Entrar</button>
        <button type="button" onClick={onSwitch}>Cadastrar</button>
      </div>

      <div className={styles.inputs}>
        <div>
          <p>Email</p>
          <input name="email" type="email" placeholder="Insira seu email" required />
        </div>
        <div>
          <p>Senha</p>
          <input name="password" type="password" placeholder="Insira sua senha" required />
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
      </div>
      <FormButton />
    </form>
  );
}
