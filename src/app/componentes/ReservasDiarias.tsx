"use client";

import { useEffect, useState } from "react";
import { IReserva } from "@/models/reserva";
import styles from "./ReservasDiarias.module.css";

export default function ReservasDiarias() {
  const [reservas, setReservas] = useState<IReserva[]>([]);

  useEffect(() => {
    fetchReservasDiarias();
  }, []);

  const fetchReservasDiarias = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const res = await fetch(`/api/reservas?data=${hoje}&status=Ativa`);
      const data = await res.json();
      if (data.success) {
        setReservas(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Group reservas by sala
  const reservasPorSala = reservas.reduce((acc, reserva) => {
    const salaNome = (reserva.salaId as any)?.nome || reserva.salaId;
    if (!acc[salaNome]) acc[salaNome] = [];
    acc[salaNome].push(reserva);
    return acc;
  }, {} as Record<string, IReserva[]>);

  return (
    <div className={styles.container}>
      <h4>Reservas do Dia</h4>
      {Object.keys(reservasPorSala).length === 0 ? (
        <p>Nenhuma reserva para hoje.</p>
      ) : (
        Object.entries(reservasPorSala).map(([salaNome, reservasSala]) => (
          <section key={salaNome} className={styles.section}>
            <h5>Sala: {salaNome}</h5>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Hora Início</th>
                  <th>Hora Fim</th>
                  <th>Usuário</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservasSala.map((reserva) => (
                  <tr key={reserva._id}>
                    <td>{reserva.horaInicio}</td>
                    <td>{reserva.horaFim}</td>
                    <td>{(reserva.usuarioId as any)?.nome || reserva.usuarioId}</td>
                    <td>{reserva.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))
      )}
    </div>
  );
}
