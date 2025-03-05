"use client"
import Admintemplate from "@/components/Admintemplate"
import { Button } from "@/components/ui/button"
import { RiSearchLine } from "react-icons/ri";
import { useState, useEffect } from 'react';
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function StockoutPage() {
  const [stockOuts, setStockOuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ดึงข้อมูลประวัติการเบิกสินค้า
  const fetchStockOuts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stockout');
      if (!response.ok) {
        throw new Error('Failed to fetch stock outs');
      }
      const data = await response.json();
      setStockOuts(data);
    } catch (error) {
      console.error('Error fetching stock outs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockOuts();
  }, []);

  // ฟังก์ชันสำหรับการค้นหา
  const handleSearch = (e) => {
    e.preventDefault();
    // ทำการกรองข้อมูลที่แสดงตาม searchTerm
    // (สำหรับตอนนี้เราจะค้นหาจากข้อมูลที่มีอยู่ในหน้า ไม่ได้เรียก API ค้นหาใหม่)
  }

  return (
    <Admintemplate>
      <div className='size-full p-10 flex items-center justify-center'>
        <div className='bg-white size-full rounded-3xl'>
          <div className="mt-5 w-full h-[70px] px-6 flex items-center justify-between">
            <p className="text-3xl">ประวัติการเบิกสินค้า</p>
            <Link href="/admin/addstockout">
              <Button className="py-2 px-4 bg-[#FFB8DA] hover:bg-[#fcc6e0]">
                เบิกสินค้าใหม่
              </Button>
            </Link>
          </div>

          <div className="w-full h-[70px] flex items-center justify-center">
            <div className="relative w-full px-6">
              <form action="" className="flex items-center justify-start" onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="ค้นหาประวัติการเบิก..."
                  className="pl-10 pr-4 mr-5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] w-[30%]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <RiSearchLine className="absolute left-9 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Button type="submit" className="py-5 bg-[#FFB8DA] hover:bg-[#fcc6e0]">ค้นหา</Button>
              </form>
            </div>
          </div>
          
          <div className="mt-2 w-full px-6">
            <Card>
              <CardHeader>
                <CardTitle>รายการประวัติการเบิกสินค้าทั้งหมด</CardTitle>
                <CardDescription>
                  จำนวนรายการทั้งหมด {stockOuts.length} รายการ
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
                ) : (
                  <div className="border rounded-md overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">รหัสนำออก</TableHead>
                          <TableHead className="w-[150px] md:w-[200px]">ชื่อสินค้า</TableHead>
                          <TableHead className="w-[75px] text-right">จำนวน</TableHead>
                          <TableHead className="w-[75px] text-right">หน่วย</TableHead>
                          <TableHead className="w-[150px]">พนักงาน</TableHead>
                          <TableHead className="w-[150px] text-right">วันที่ทำรายการ</TableHead>
                          <TableHead className="w-[150px] text-right">หมายเหตุ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stockOuts.length > 0 ? (
                          stockOuts.map((stockOut) => (
                            <TableRow key={stockOut.TimeScriptionID}>
                              <TableCell className="font-medium">{stockOut.TimeScriptionID}</TableCell>
                              <TableCell>{stockOut.stock?.ingredientName || 'ไม่ระบุ'}</TableCell>
                              <TableCell className="text-right">{stockOut.Quantity}</TableCell>
                              <TableCell className="text-right">{stockOut.Unit}</TableCell>
                              <TableCell>
                                {stockOut.employee?.empFname} {stockOut.employee?.empLname}
                              </TableCell>
                              <TableCell className="text-right">
                                {stockOut.tsCreatedAt 
                                  ? new Date(stockOut.tsCreatedAt).toLocaleString('th-TH') 
                                  : 'ไม่ระบุ'
                                }
                              </TableCell>
                              <TableCell className="text-right">{stockOut.note || '-'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              ไม่พบข้อมูลประวัติการเบิกสินค้า
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Admintemplate>
  )
}

export default StockoutPage