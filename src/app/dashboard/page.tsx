"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardAdmin from "../componentes/DashboardAdmin";
import DashboardComum from "../componentes/DashboardComum";
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
            return <DashboardComum />;
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