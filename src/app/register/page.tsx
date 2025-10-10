"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

export default function RegisterPage() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch("/api/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess("Usuário registrado com sucesso! Redirecionando para login...");
                setTimeout(() => {
                    router.push("/login");
                }, 2000);
            } else {
                const erroData = data.error || data;
                if (typeof erroData === 'object') {
                    setError(erroData.errmsg || erroData.message || JSON.stringify(erroData));
                } else {
                    setError(erroData || "Falha no registro");
                }
            }
        } catch (error) {
            console.error("Registro Failed:", error);
            setError("Erro de Servidor");
        }
    };

    return (
        <div className={styles.center}>
            <h2>Registro de Usuário</h2>
            {error && <p className={styles.error}>{error}</p>}
            {success && <p className={styles.success}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="nome">Nome</label>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        id="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrar</button>
            </form>
            <p>
                Já tem uma conta? <a href="/login">Faça login aqui</a>
            </p>
        </div>
    );
}
