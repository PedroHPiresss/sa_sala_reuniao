//Rotas que Precisam do ID ( PATCH ou PUT. DELETE, GET(one))

import { deleteSala, getSalaById, updateSala } from "@/controllers/salaController";
import { NextRequest, NextResponse } from "next/server";

interface Parametro{
    id:string;
}

//PATCH
export async function PATCH(req: NextRequest, { params }: { params: Parametro }){
    try {
        const {id} = params;
        const data = await req.json();
        const SalaAtualizada = await updateSala(id, data);
        if(!SalaAtualizada){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:SalaAtualizada});
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

//GET(one)
export async function GET (req: NextRequest, { params }: { params: Parametro }){
    try {
        const {id} = params;
        const data = await getSalaById(id);
        if(!data){
            return NextResponse.json({success:false, error: "Not Found"});
        }
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error:error});
    }
}

//DELETE
export async function DELETE(req: NextRequest, { params }: { params: Parametro }) {
    try {
        const {id} = params;
        await deleteSala(id);
        return NextResponse.json({success: true, message: "Sala deletada com sucesso"});

    } catch (error) {
        return NextResponse.json({success:false, error: error instanceof Error ? error.message : "Erro ao deletar sala"});
    }
}
