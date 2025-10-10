"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardTecnico from "../componentes/DashboardTecnico";
import DashboardAdmin from "../componentes/DashboardAdmin";
import DashboardGerente from "../componentes/DashboardGerente";
import styles from "./page.module.css";

export default function DashboardPage(){
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);
    
    useEffect(()=>{
        const role = localStorage.getItem("userRole");
        if(!role){
            router.push("/login"); //redireciona para login se não estiver logado
        }else{
            setUserRole(role);
        }
    }, [router]);

    const handleLogout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        router.push("/login");
    };

    const renderDashboard = () => {
        if( userRole === "Administrador"){
            return <DashboardAdmin />;
        } else {
            return <div><h2>Dashboard Usuário Comum</h2><p>Funcionalidades para usuários comuns aqui.</p></div>;
        }
    };

    return (
        <div>
            <header className={styles.header}>
                <h1>Bem-Vindo</h1>
                <button onClick={handleLogout}>Logout</button>
            </header>
            <main className={styles.main}>
                {renderDashboard()}
            </main>
        </div>
    )
}