
import connectMongo from "@/services/mongodb";
import Sala, { ISala } from "../models/sala";

export const getSalas = async () => {
  await connectMongo();
  const salas = await Sala.find({});
  return salas;
};

export const getSalaById = async (id: string) => {
  await connectMongo();
  const sala = await Sala.findById(id);
  return sala;
};

export const createSala = async (data: Partial<ISala>) => {
  await connectMongo();
  const novaSala = new Sala(data);
  await novaSala.save();
  return novaSala;
};

export const updateSala = async (id: string, data: Partial<ISala>) => {
  await connectMongo();
  const sala = await Sala.findByIdAndUpdate(id, data, { new: true });
  return sala;
};

export const deleteSala = async (id: string) => {
  await connectMongo();
  await Sala.findByIdAndDelete(id);
};
