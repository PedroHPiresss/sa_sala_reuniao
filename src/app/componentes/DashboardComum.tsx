"use client";

import { useEffect, useState } from "react";
import { ISala } from "@/models/sala";
import { IReserva } from "@/models/reserva";
import ReservasDiarias from "./ReservasDiarias";

import styles from "./DashboardComum.module.css";

export default function DashboardComum() {
  const [salas, setSalas] = useState<ISala[]>([]);
  const [minhasReservas, setMinhasReservas] = useState<IReserva[]>([]);
  const [novaReserva, setNovaReserva] = useState({
    salaId: "",
    data: new Date().toISOString().split('T')[0],
    horaInicio: "",
    horaFim: "",
  });

  useEffect(() => {
    fetchSalas();
    fetchMinhasReservas();
  }, []);

  const fetchSalas = async () => {
    try {
      const res = await fetch("/api/salas");
      const data = await res.json();
      if (data.success) {
        setSalas(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMinhasReservas = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;
    try {
      const res = await fetch(`/api/reservas?usuarioId=${userId}&status=Ativa`);
      const data = await res.json();
      if (data.success) {
        setMinhasReservas(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateReserva = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuário não logado. Faça login novamente.");
      return;
    }

    try {
      const res = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...novaReserva, usuarioId: userId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Reserva criada com sucesso!");
        setNovaReserva({
          salaId: "",
          data: new Date().toISOString().split('T')[0],
          horaInicio: "",
          horaFim: "",
        });
        fetchMinhasReservas(); // Refresh minhas reservas
      } else {
        alert("Erro ao criar reserva: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelReserva = async (reservaId: string) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Usuário não logado. Faça login novamente.");
      return;
    }

    try {
      const res = await fetch(`/api/reservas/${reservaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelada", usuarioId: userId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Reserva cancelada com sucesso!");
        fetchMinhasReservas(); // Refresh minhas reservas
      } else {
        alert("Erro ao cancelar reserva: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Painel do Usuário Comum</h3>

      <ReservasDiarias />

      <section className={styles.section}>
        <h4>Minhas Reservas</h4>
        {minhasReservas.length === 0 ? (
          <p>Você não tem reservas ativas.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sala</th>
                <th>Data</th>
                <th>Hora Início</th>
                <th>Hora Fim</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {minhasReservas.map((reserva) => (
                <tr key={reserva._id}>
                  <td>{(reserva.salaId as any)?.nome || reserva.salaId}</td>
                  <td>{new Date(reserva.data).toLocaleDateString()}</td>
                  <td>{reserva.horaInicio}</td>
                  <td>{reserva.horaFim}</td>
                  <td>
                    <button onClick={() => handleCancelReserva(reserva._id)}>Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className={styles.section}>
        <h4>Fazer Reserva</h4>
        <div className={styles.form}>
          <select
            value={novaReserva.salaId}
            onChange={(e) => setNovaReserva({ ...novaReserva, salaId: e.target.value })}
          >
            <option value="">Selecione uma sala</option>
            {salas.map((sala) => (
              <option key={sala._id} value={sala._id}>
                {sala.nome} - Capacidade: {sala.capacidade} - Recursos: {sala.recursos}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={novaReserva.data}
            onChange={(e) => setNovaReserva({ ...novaReserva, data: e.target.value })}
          />
          <input
            type="time"
            placeholder="Hora Início"
            value={novaReserva.horaInicio}
            onChange={(e) => setNovaReserva({ ...novaReserva, horaInicio: e.target.value })}
          />
          <input
            type="time"
            placeholder="Hora Fim"
            value={novaReserva.horaFim}
            onChange={(e) => setNovaReserva({ ...novaReserva, horaFim: e.target.value })}
          />
          <button onClick={handleCreateReserva}>Reservar</button>
        </div>
      </section>
    </div>
  );
}
