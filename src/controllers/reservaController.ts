
import connectMongo from "@/services/mongodb";
import Reserva, { IReserva } from "../models/reserva";

export const getReservas = async (filters: { status?: string; data?: string; usuarioId?: string } = {}) => {
  await connectMongo();
  const query: any = {};
  if (filters.status) query.status = filters.status;
  if (filters.data) query.data = filters.data;
  if (filters.usuarioId) query.usuarioId = filters.usuarioId;
  const reservas = await Reserva.find(query).populate('usuarioId').populate('salaId');
  return reservas;
};

export const getReservaById = async (id: string) => {
  await connectMongo();
  const reserva = await Reserva.findById(id).populate('usuarioId').populate('salaId');
  return reserva;
};

export const createReserva = async (data: Partial<IReserva>) => {
  await connectMongo();
  // Check for conflicts
  const conflitos = await Reserva.find({
    salaId: data.salaId,
    data: data.data,
    status: "Ativa",
    $or: [
      {
        $and: [
          { horaInicio: { $lt: data.horaFim } },
          { horaFim: { $gt: data.horaInicio } }
        ]
      }
    ]
  });
  if (conflitos.length > 0) {
    throw new Error("Conflito de horário: sala já reservada neste período");
  }
  const novaReserva = new Reserva(data);
  await novaReserva.save();
  return novaReserva;
};

export const updateReserva = async (id: string, data: Partial<IReserva>) => {
  await connectMongo();
  const reserva = await Reserva.findByIdAndUpdate(id, data, { new: true });
  return reserva;
};

export const deleteReserva = async (id: string) => {
  await connectMongo();
  const reserva = await Reserva.findById(id);
  if (!reserva) {
    throw new Error("Reserva não encontrada");
  }
  if (reserva.status !== "Cancelada") {
    throw new Error("Apenas reservas canceladas podem ser deletadas permanentemente");
  }
  await Reserva.findByIdAndDelete(id);
  return reserva;
};

export const cancelReserva = async (id: string, usuarioId?: string) => {
  await connectMongo();
  const reserva = await Reserva.findById(id);
  if (!reserva) {
    throw new Error("Reserva não encontrada");
  }
  if (usuarioId && reserva.usuarioId.toString() !== usuarioId) {
    throw new Error("Apenas o criador da reserva pode cancelá-la");
  }
  reserva.status = "Cancelada";
  await reserva.save();
  return reserva;
};
