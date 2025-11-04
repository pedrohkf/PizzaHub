"use client";

import { useState } from "react";
import Delete from "../../../../public/imgs/Delete";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
    pizzariaId: string;
    onDeleted?: () => void;
}

export default function DeleteButton({ pizzariaId, onDeleted }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    async function handleDelete() {
        const confirmar = window.confirm("Tem certeza que deseja excluir esta pizzaria?");
        if (!confirmar) return;

        setLoading(true);

        try {
            const res = await fetch(`https://pizza-hub-lime.vercel.app/api/pizzarias/delete/${pizzariaId}`, {
                method: "POST",
            });

            if (!res.ok) throw new Error("Erro ao excluir pizzaria");

            router.push("/pizzahub/pizzarias");
            alert("Pizzaria excluída com sucesso!");

            onDeleted?.();
        } catch (err) {
            console.error(err);
            alert("Erro ao excluir pizzaria. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <button onClick={handleDelete} disabled={loading} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            {loading ? "..." : <Delete />}
        </button>
    );
}
