'use client';
import { useState } from "react";
import loginAction from "@/app/actions/login";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const { login: setUser } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string>();

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
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Senha" required />
      <button type="submit">Entrar</button>
      <button type="button" onClick={onSwitch}>Cadastrar</button>
      {error && <p>{error}</p>}
    </form>
  );
}
