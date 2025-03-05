import { NextResponse } from "next/server";
import { fetchStockIn } from "../../../actions/actions";

export async function GET() {
    const stockIn = await fetchStockIn()
    return Response.json(stockIn);
}