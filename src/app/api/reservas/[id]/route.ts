//Rotas que Precisam do ID ( PATCH ou PUT. DELETE, GET(one))

import { deleteReserva, getReservaById, updateReserva } from "@/controllers/reservaController";

import { NextRequest, NextResponse } from "next/server";

interface Parametro{
    id:string;
}

//PATCH
export async function PATCH(req: NextRequest, {params}:{params:Parametro}){
    try {
        const {id} = params;
        const data = await req.json();
        const ReservaAtualizada = await updateReserva(id, data);
        if(!ReservaAtualizada){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:ReservaAtualizada});
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

//GET(one)
export async function GET ({params}:{params:Parametro}){
    try {
        const {id} = params;
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
export async function DELETE({params}:{params:Parametro}) {
    try {
        const {id} = params;
        await deleteReserva(id);
        return NextResponse.json({success: true, data:{}});

    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}
