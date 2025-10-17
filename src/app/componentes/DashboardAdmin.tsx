"use client";

import { useEffect, useState } from "react";
import { IUsuario } from "@/models/usuario";
import { ISala } from "@/models/sala";
import { IReserva } from "@/models/reserva";
import ReservasDiarias from "./ReservasDiarias";

import styles from "./DashboardAdmin.module.css";

export default function DashboardAdmin() {
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [reservas, setReservas] = useState<IReserva[]>([]);
  const [novaSala, setNovaSala] = useState({ nome: "", capacidade: 0, recursos: "" });
  const [editingSala, setEditingSala] = useState<ISala | null>(null);

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

  const handleCreateSala = async () => {
    try {
      const res = await fetch("/api/salas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaSala),
      });
      const data = await res.json();
      if (data.success) {
        setSalas([...salas, data.data]);
        setNovaSala({ nome: "", capacidade: 0, recursos: "" });
      } else {
        alert("Erro ao criar sala: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSala = (sala: ISala) => {
    setEditingSala(sala);
    setNovaSala({ nome: sala.nome, capacidade: sala.capacidade, recursos: sala.recursos });
  };

  const handleUpdateSala = async () => {
    if (!editingSala) return;
    try {
      const res = await fetch(`/api/salas/${editingSala._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaSala),
      });
      const data = await res.json();
      if (data.success) {
        setSalas(salas.map(s => s._id === editingSala._id ? data.data : s));
        setEditingSala(null);
        setNovaSala({ nome: "", capacidade: 0, recursos: "" });
      } else {
        alert("Erro ao atualizar sala: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSala = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta sala?")) return;
    try {
      const res = await fetch(`/api/salas/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setSalas(salas.filter(s => s._id !== id));
        alert("Sala deletada com sucesso!");
      } else {
        alert("Erro ao deletar sala: " + (data.error || "Erro desconhecido"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelReserva = async (id: string) => {
    try {
      const res = await fetch(`/api/reservas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelada" }),
      });
      const data = await res.json();
      if (data.success) {
        setReservas(reservas.map(r => r._id === id ? { ...r, status: "Cancelada" } : r));
      } else {
        alert("Erro ao cancelar reserva: " + data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReserva = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta reserva permanentemente?")) return;
    try {
      const res = await fetch(`/api/reservas/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setReservas(reservas.filter(r => r._id !== id));
        alert("Reserva deletada com sucesso!");
      } else {
        alert("Erro ao deletar reserva: " + (data.error?.message || JSON.stringify(data.error) || "Erro desconhecido"));
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
        <div className={styles.form}>
          <input
            type="text"
            placeholder="Nome"
            value={novaSala.nome}
            onChange={(e) => setNovaSala({ ...novaSala, nome: e.target.value })}
          />
          <input
            type="number"
            placeholder="Capacidade"
            value={novaSala.capacidade}
            onChange={(e) => setNovaSala({ ...novaSala, capacidade: parseInt(e.target.value) })}
          />
          <input
            type="text"
            placeholder="Recursos"
            value={novaSala.recursos}
            onChange={(e) => setNovaSala({ ...novaSala, recursos: e.target.value })}
          />
          {editingSala ? (
            <>
              <button onClick={handleUpdateSala}>Atualizar</button>
              <button onClick={() => { setEditingSala(null); setNovaSala({ nome: "", capacidade: 0, recursos: "" }); }}>Cancelar</button>
            </>
          ) : (
            <button onClick={handleCreateSala}>Criar Sala</button>
          )}
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Capacidade</th>
              <th>Recursos</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {salas.map((sala) => (
              <tr key={sala._id}>
                <td>{sala.nome}</td>
                <td>{sala.capacidade}</td>
                <td>{sala.recursos}</td>
                <td>
                  <button onClick={() => handleEditSala(sala)}>Editar</button>
                  <button onClick={() => handleDeleteSala(sala._id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <ReservasDiarias />
      <section className={styles.section}>
        <h4>Todas as Reservas</h4>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora Início</th>
              <th>Hora Fim</th>
              <th>Status</th>
              <th>Usuário</th>
              <th>Sala</th>
              <th>Ações</th>
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
                <td>
                  {reserva.status === "Ativa" && (
                    <button onClick={() => handleCancelReserva(reserva._id)}>Cancelar</button>
                  )}
                  <button onClick={() => handleDeleteReserva(reserva._id)}>Deletar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
