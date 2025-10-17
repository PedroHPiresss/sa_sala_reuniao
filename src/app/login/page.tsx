"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./page.module.css";

//responsável pela interação com o usuário, como cliques e digitação

export default function LoginPage() {
    const [email, setEmail] = useState(""); //CAMPO PARA digitação do email
    const [senha, setSenha] = useState(""); // campo para digitação da senha
    const [error, setError] = useState(""); //mensagem de erro caso ocorra

    const router = useRouter(); //rotas de navegação entre páginas

    //METODO PARA  enviar login
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();// evita o recarregamento da pagina
        setError("");

        try {
            const response = await fetch(
                "/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            }
            );
            //analisar a resposta do fetch
            const data = await response.json()
            if (data.success) {
                // armazenar as informações do usuário no localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("userRole", data.usuario?.tipo || "");
                localStorage.setItem("userId", data.usuario?.id || "");
                router.push("/dashboard"); // redireciona para a pagina principal após o login bem-sucedido
            } else {
                // data.error may be an object/string depending on the API
                const erroData = data.error || data;
                setError((erroData && erroData.message) || erroData || "Falha de login");
            }
        } catch (error) {
            console.error("Login Failed:", error);
            setError("Erro de Servidor");
        }
    }

    //react DOM
    return (
        <div className={styles.center}>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles.username}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />
                </div>
                <div className={styles.password}>
                    <label htmlFor="senha">Senha</label>
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required />
                </div>
                <button type="submit">Entrar</button>
            </form>
            <p>
                Não tem conta? <a href="/register">Cadastre-se aqui</a>
            </p>
        </div>
    );
}
