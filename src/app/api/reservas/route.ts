// rotas que não precisam de ID (GET / POST)

import { createReserva, getReservas } from "@/controllers/reservaController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        const data = await getReservas();//busca todos as reservas
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error:error})
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newReserva = await createReserva(data);
        return NextResponse.json({success:true, data: newReserva});
    } catch (error) {
        return NextResponse.json({success:false, error:error})
    }
}
