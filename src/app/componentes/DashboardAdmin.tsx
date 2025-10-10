"use-client";

import { useEffect, useState } from "react";
import { IUsuario } from "@/models/usuario";
import { ISala } from "@/models/sala";
import { IReserva } from "@/models/reserva";

import styles from "./DashboardAdmin.module.css";

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [reservas, setReservas] = useState<IReserva[]>([]);

  useEffect(() => {
    fetchUsuarios();
    fetchSalas();
    fetchReservas();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const res = await fetch("/api/usuarios");
      const data = await res.json();
      if (data.success) {
        setUsuarios(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  const fetchReservas = async () => {
    try {
      const res = await fetch("/api/reservas");
      const data = await res.json();
      if (data.success) {
        setReservas(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Painel de Controle - Administrador</h3>

      <section className={styles.section}>
        <h4>Usuários</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario._id}>
                <td>{usuario.nome}</td>
                <td>{usuario.email}</td>
                <td>{usuario.tipo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h4>Salas</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Capacidade</th>
              <th>Recursos</th>
            </tr>
          </thead>
          <tbody>
            {salas.map((sala) => (
              <tr key={sala._id}>
                <td>{sala.nome}</td>
                <td>{sala.capacidade}</td>
                <td>{sala.recursos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h4>Reservas</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora Início</th>
              <th>Hora Fim</th>
              <th>Status</th>
              <th>Usuário</th>
              <th>Sala</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva._id}>
                <td>{new Date(reserva.data).toLocaleDateString()}</td>
                <td>{reserva.horaInicio}</td>
                <td>{reserva.horaFim}</td>
                <td>{reserva.status}</td>
                <td>{(reserva.usuarioId as any)?.nome || reserva.usuarioId}</td>
                <td>{(reserva.salaId as any)?.nome || reserva.salaId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
