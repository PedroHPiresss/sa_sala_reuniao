//Modelo de Criação de Usuário com Bcrypt

import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUsuario extends Document{
    _id:string; //vou precisar do _id no view // evita erro no código
    nome: string;
    email: string;
    username: string;
    senha?:string; // que pode ser nulo ( nao vou retonar a senha)
    tipo: string;
    comparePassword(userPassword:string): Promise<boolean>;
}

//criaração do SCHEMa do MongoDB (construtor)

const UsuarioSchema: Schema<IUsuario> = new Schema({
    nome:{type:String, required:true},
    email:{type:String, required:true, unique:true},
    username:{type:String, required:true, unique:true},
    senha:{type:String, required:true, select:false},
    tipo:{type: String, enum:["Administrador","Comum"],required:true}
    //select impede que a senha retorne por padrão
});

//Middleware para hashear a senha
//serve para criptografar a senha quando for armazenar u usuário no BD
UsuarioSchema.pre<IUsuario>('save', async function (next){
    if(!this.isModified('senha') || !this.senha) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.senha = await bcrypt.hash(this.senha, salt);
        next();
    } catch (error:any) {
        next(error);
    }
})

//método para comparar senha
//quando o usuário for fazer o login (compara a senha digitada e criptografasda com a senha criptografada do banco)
UsuarioSchema.methods.comparePassword = function (userPassword:string):Promise<boolean>{
    return bcrypt.compare(userPassword, this.senha);
}

//to e from
const Usuario: Model<IUsuario> = mongoose.models.Usuario || mongoose.model<IUsuario>("Usuario", UsuarioSchema);


export default Usuario;

