
import connectMongo from "@/services/mongodb";
import Reserva, { IReserva } from "../models/reserva";

export const getReservas = async () => {
  await connectMongo();
  const reservas = await Reserva.find({}).populate('usuarioId').populate('salaId');
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
  await Reserva.findByIdAndDelete(id);
};
