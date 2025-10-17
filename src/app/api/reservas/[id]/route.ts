//Rotas que Precisam do ID ( PATCH ou PUT. DELETE, GET(one))

import { cancelReserva, deleteReserva, getReservaById, updateReserva } from "@/controllers/reservaController";
import { NextRequest, NextResponse } from "next/server";

interface Parametro{
    id:string;
}

// PATCH
export async function PATCH(req: NextRequest, { params }: { params: Parametro }){
    try {
        const { id } = params;
        const data = await req.json();
        let ReservaAtualizada;
        if (data.status === "Cancelada") {
            const usuarioId = data.usuarioId; // usuarioId é opcional agora
            ReservaAtualizada = await cancelReserva(id, usuarioId);
        } else {
            ReservaAtualizada = await updateReserva(id, data);
        }
        if(!ReservaAtualizada){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:ReservaAtualizada});
    } catch (error) {
        return NextResponse.json({success:false, error: error instanceof Error ? error.message : String(error)});
    }
}

// GET (one)
export async function GET (req: NextRequest, { params }: { params: Parametro }){
    try {
        const { id } = params;
        const data = await getReservaById(id);
        if(!data){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error: error instanceof Error ? error.message : String(error)});
    }
}

// DELETE
export async function DELETE(req: NextRequest, { params }: { params: Parametro }) {
    try {
        const { id } = params;
        const deleted = await deleteReserva(id);
        if (!deleted) {
            return NextResponse.json({success: false, error: "Reserva não encontrada"});
        }
        return NextResponse.json({success: true, data:{}});

    } catch (error) {
        return NextResponse.json({success:false, error: error instanceof Error ? error.message : String(error)});
    }
}
