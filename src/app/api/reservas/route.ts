// rotas que não precisam de ID (GET / POST)

import { createReserva, getReservas } from "@/controllers/reservaController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const dataParam = searchParams.get('data');
        const usuarioId = searchParams.get('usuarioId');
        const filters: { status?: string; data?: string; usuarioId?: string } = {};
        if (status) filters.status = status;
        if (dataParam) filters.data = dataParam;
        if (usuarioId) filters.usuarioId = usuarioId;
        const data = await getReservas(filters);
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
