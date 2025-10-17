//Rotas que Precisam do ID ( PATCH ou PUT. DELETE, GET(one))

import { cancelReserva, deleteReserva, getReservaById, updateReserva } from "@/controllers/reservaController";

import { NextRequest, NextResponse } from "next/server";

interface Parametro{
    id:string;
}

//PATCH
export async function PATCH(req: NextRequest, {params}:{params:Promise<Parametro>}){
    try {
        const {id} = await params;
        const data = await req.json();
        let ReservaAtualizada;
        if (data.status === "Cancelada") {
            const usuarioId = data.usuarioId;
            if (!usuarioId) {
                return NextResponse.json({success:false, error: "usuarioId necessário para cancelar reserva"});
            }
            ReservaAtualizada = await cancelReserva(id, usuarioId);
        } else {
            ReservaAtualizada = await updateReserva(id, data);
        }
        if(!ReservaAtualizada){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:ReservaAtualizada});
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

//GET(one)
export async function GET ({params}:{params:Promise<Parametro>}){
    try {
        const {id} = await params;
        const data = await getReservaById(id);
        if(!data){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

//DELETE
export async function DELETE({params}:{params:Promise<Parametro>}) {
    try {
        const {id} = await params;
        const deleted = await deleteReserva(id);
        if (!deleted) {
            return NextResponse.json({success: false, error: "Reserva não encontrada"});
        }
        return NextResponse.json({success: true, data:{}});

    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}
