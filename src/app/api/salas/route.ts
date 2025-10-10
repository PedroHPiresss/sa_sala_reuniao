// rotas que não precisam de ID (GET / POST)

import { createSala, getSalas } from "@/controllers/salaController";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        const data = await getSalas();//busca todos as salas no banco
        return NextResponse.json({success:true, data:data});
    } catch (error) {
        return NextResponse.json({success:false, error:error})
    }
}

export async function POST(req: NextRequest) {

    try {
        const data = await req.json();
        const newSala = await createSala(data);
        return NextResponse.json({success:true, data: newSala});
    } catch (error) {
        return NextResponse.json({success:false, error:error})
    }
}
