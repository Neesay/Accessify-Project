import { getPassword } from "@/lib/database";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest){
    const username = request.nextUrl.searchParams.get("username")
    const password = await getPassword(username);
    
    
    return NextResponse.json({event: response})
}