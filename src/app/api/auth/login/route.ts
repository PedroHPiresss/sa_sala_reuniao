//criar a rota api de login

import { autenticaUsuario } from "@/controllers/usuarioController";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET){
    throw new Error("JWT_SECRET não está definida nas variáveis locais");
}

export async function POST(req: Request){
    try {
        const{email, senha} = await req.json();
        //validar os dados
        if(!email || !senha){
            return NextResponse.json({success:false, error: "Email e senha são necessários" })
        }
        //método de authenticação
        const usuario = await autenticaUsuario(email, senha);
        if(!usuario){
            return NextResponse.json({success:false, error: "Email ou senha inválidos" })
        }
        //criar o Token JWT
        const token = jwt.sign(
            {id: usuario._id, email: usuario.email, tipo: usuario.tipo},
            JWT_SECRET as string,
            { expiresIn: "1h"}
        );
        //retornsr o token
        return NextResponse.json({success:true, token, usuario: {id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo}});
    } catch (error) {
        return NextResponse.json({success:false, error: error });
    }
}
