import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReserva extends Document{
    _id:string;
    data: Date;
    horaInicio: string;
    horaFim: string;
    status: string;
    usuarioId: mongoose.Types.ObjectId;
    salaId: mongoose.Types.ObjectId;
}

const ReservaSchema:Schema<IReserva> = new Schema({
    data:{type: Date, required: true},
    horaInicio:{type: String, required: true},
    horaFim:{type: String, required: true},
    status: {type:String,
            enum: ["Ativa","Cancelada"],
            default: "Ativa"},
    usuarioId: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true},
    salaId: {type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true}
});

const Reserva: Model<IReserva> = mongoose.models.Reserva
|| mongoose.model<IReserva>("Reserva",ReservaSchema);

export default Reserva;
