"use-client";

import { IOrdemServico } from "@/models/ordemServico";
import { useEffect, useState } from "react";
import styles from "./DashboardTecnico.module.css";

export default function DashboardTecnico(){
    // aramazenar as tarefas em um vetor
    const [ordens, setOrdens] = useState<IOrdemServico[]>([]);

    useEffect(()=>{
        fetchOrdens();
    }, []);

    const fetchOrdens = async () =>{
        try {
            const resposta = await fetch("/api/ordemservicos"); //http request ->
            const data = await resposta.json();
            if(data.success){
                setOrdens(data.data)
            }
        } catch (error) {
            console.error(error);
        }
    }

    return(
        <div className={styles.container}>
            <h3 className={styles.title}>Minhas Ordens de Serviço</h3>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Tipo de Manutenção</th>
                        <th>Data Solicitação</th>
                        <th>Data Finalização</th>
                        <th>Id Equipamento</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {ordens.map((ordem)=>(
                        <tr key = {ordem._id}>
                            <td>{ordem.titulo}</td>
                            <td>{ordem.descricao}</td>
                            <td>{ordem.status}</td>
                            <td>{ordem.tipoManutencao}</td>
                            <td>{ordem.dataSolicitada.toDateString()}</td>
                            <td>{ordem.dataFinalizada?.toDateString()}</td>
                            <td>{ordem.equipamentoId}</td>
                            <td><button className={styles.button}>Finalizar Serviço</button></td>


                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
}