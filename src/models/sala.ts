import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISala extends Document{
    _id:string;
    nome:string;
    capacidade:number;
    recursos:string;
}

const SalaSchema:Schema<ISala> = new Schema({
    nome:{type:String, required: true, unique: true},
    capacidade:{type:Number, required: true},
    recursos:{type:String, required: true}
});

const Sala: Model<ISala> = mongoose.models.Sala
|| mongoose.model<ISala>("Sala",SalaSchema);

export default Sala;
