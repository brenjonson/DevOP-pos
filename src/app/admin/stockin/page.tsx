"use client"
import React, { useState, useEffect } from 'react';
import Admintemplate from "@/components/Admintemplate";
import { Button } from "@/components/ui/button";
import { 
  Calendar, Search, Eye, ArrowUpDown, 
  Download, RefreshCw, Plus 
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Modalreceipt from "@/components/Modalreceipt";
import { fetchStockInDetails } from "@/actions/actions";
import { Badge } from "@/components/ui/badge";

export default function StockInPage() {
  const [stockIns, setStockIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockInDetails, setStockInDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredStockIns, setFilteredStockIns] = useState([]);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [sortDirection, setSortDirection] = useState({ date: 'desc', price: null });
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalValue: 0,
    averageValue: 0
  });

  // ดึงข้อมูลการนำเข้า
  const fetchStockIns = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stockin');
      if (!response.ok) {
        throw new Error('Failed to fetch stock ins');
      }
      const data = await response.json();
      setStockIns(data);
      setFilteredStockIns(data);
      
      // คำนวณสถิติ
      const totalValue = data.reduce((sum, item) => sum + item.totalPrice, 0);
      setStats({
        totalEntries: data.length,
        totalValue: totalValue,
        averageValue: data.length > 0 ? totalValue / data.length : 0
      });
    } catch (error) {
      console.error('Error fetching stock ins:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockIns();
  }, []);

  // ดูรายละเอียด
  const handleViewDetails = async (stockInID) => {
    try {
      const data = await fetchStockInDetails(stockInID);
      setStockInDetails(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching stock in details:', error);
      alert('ไม่สามารถดึงข้อมูลรายละเอียดได้');
    }
  };

  // ค้นหา
  const handleSearch = (e) => {
    e.preventDefault();
    filterData();
  };

  // กรองข้อมูล
  const filterData = () => {
    let filtered = [...stockIns];
    
    // กรองตามคำค้นหา
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.employee?.empFname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.employee?.empLname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stockInID.toString().includes(searchTerm) ||
        (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // กรองตามช่วงวันที่
    if (dateRange.from && dateRange.to) {
      const fromDate = new Date(dateRange.from);
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59); // ถึงสิ้นวัน
      
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.stockInDateTime);
        return itemDate >= fromDate && itemDate <= toDate;
      });
    }
    
    setFilteredStockIns(filtered);
    
    // คำนวณสถิติใหม่
    const totalValue = filtered.reduce((sum, item) => sum + item.totalPrice, 0);
    setStats({
      totalEntries: filtered.length,
      totalValue: totalValue,
      averageValue: filtered.length > 0 ? totalValue / filtered.length : 0
    });
  };

  // เรียงข้อมูล
  const sortByDate = () => {
    const newDirection = sortDirection.date === 'asc' ? 'desc' : 'asc';
    setSortDirection({ ...sortDirection, date: newDirection });
    
    const sorted = [...filteredStockIns].sort((a, b) => {
      const dateA = new Date(a.stockInDateTime);
      const dateB = new Date(b.stockInDateTime);
      return newDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredStockIns(sorted);
  };
  
  const sortByPrice = () => {
    const newDirection = sortDirection.price === 'asc' ? 'desc' : 'asc';
    setSortDirection({ ...sortDirection, price: newDirection });
    
    const sorted = [...filteredStockIns].sort((a, b) => {
      return newDirection === 'asc' ? a.totalPrice - b.totalPrice : b.totalPrice - a.totalPrice;
    });
    
    setFilteredStockIns(sorted);
  };

  // ฟอร์แมตราคา
  const formatPrice = (price) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB'
    }).format(price);
  };

  return (
    <Admintemplate>
      <div className="p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">ประวัติการนำเข้าสินค้า</h1>
            <p className="text-gray-500 mt-1">ดูประวัติและรายละเอียดการนำเข้าสินค้าทั้งหมด</p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Link href="/admin/stockindetail">
              <Button className="bg-[#FFB8DA] hover:bg-[#fcc6e0]">
                <Plus className="h-4 w-4 mr-2" /> นำเข้าสินค้าใหม่
              </Button>
            </Link>
            <Button variant="outline" onClick={fetchStockIns}>
              <RefreshCw className="h-4 w-4 mr-2" /> รีเฟรช
            </Button>
          </div>
        </div>
        
        {/* สรุปข้อมูล */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">จำนวนรายการทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEntries} รายการ</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">มูลค่ารวมทั้งหมด</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatPrice(stats.totalValue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">มูลค่าเฉลี่ยต่อรายการ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.averageValue)}</div>
            </CardContent>
          </Card>
        </div>
        
        {/* ส่วนค้นหาและกรอง */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ค้นหาตามรหัส, พนักงาน, หมายเหตุ..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FFB8DA]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 border px-3 py-2 rounded-md">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">
                    {dateRange.from && dateRange.to ? 
                      `${new Date(dateRange.from).toLocaleDateString()} - ${new Date(dateRange.to).toLocaleDateString()}` : 
                      'ทุกวัน'}
                  </span>
                </div>
                <Button type="button" className="bg-[#FFB8DA] hover:bg-[#fcc6e0]" onClick={filterData}>
                  ค้นหา
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ตารางข้อมูล */}
        <Card>
          <CardHeader>
            <CardTitle>ประวัติการนำเข้าสินค้า</CardTitle>
            <CardDescription>
              แสดงผล {filteredStockIns.length} รายการ จากทั้งหมด {stockIns.length} รายการ
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFB8DA]"></div>
                <span className="ml-2">กำลังโหลดข้อมูล...</span>
              </div>
            ) : filteredStockIns.length === 0 ? (
              <div className="text-center py-10 border rounded-md bg-gray-50">
                <p className="text-gray-500">ไม่พบข้อมูลการนำเข้าสินค้า</p>
              </div>
            ) : (
              <div className="border rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">รหัส</TableHead>
                      <TableHead className="cursor-pointer" onClick={sortByDate}>
                        <div className="flex items-center">
                          วันที่และเวลา
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={sortByPrice}>
                        <div className="flex items-center justify-end">
                          มูลค่ารวม
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>พนักงาน</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                      <TableHead className="text-right">จัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStockIns.map((stockIn) => (
                      <TableRow key={stockIn.stockInID}>
                        <TableCell className="font-medium">{stockIn.stockInID}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(stockIn.stockInDateTime).toLocaleString('th-TH')}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatPrice(stockIn.totalPrice)}
                        </TableCell>
                        <TableCell>
                          {stockIn.employee ? (
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                                {stockIn.employee.empFname.charAt(0)}
                              </div>
                              <span>{stockIn.employee.empFname} {stockIn.employee.empLname}</span>
                            </div>
                          ) : 'ไม่ระบุ'}
                        </TableCell>
                        <TableCell>
                          {stockIn.isCanceled ? (
                            <Badge variant="destructive">ยกเลิกแล้ว</Badge>
                          ) : (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                              สำเร็จ
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {stockIn.note || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">เปิดเมนู</span>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(stockIn.stockInID)}>
                                ดูรายละเอียด
                              </DropdownMenuItem>
                              <DropdownMenuItem>พิมพ์ใบนำเข้า</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal แสดงรายละเอียด */}
        {isModalOpen && stockInDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Modalreceipt
              receiptNumber={stockInDetails.stockIn.stockInID.toString()}
              date={new Date(stockInDetails.stockIn.stockInDateTime).toLocaleString('th-TH')}
              staffName={`${stockInDetails.stockIn.employee.empFname} ${stockInDetails.stockIn.employee.empLname}`}
              items={stockInDetails.details.map(detail => ({
                name: detail.ingredientName,
                quantity: detail.quantity,
                unit: detail.unit,
                pricePerUnit: detail.pricePerUnit,
                totalPrice: detail.totalPrice
              }))}
              totalAmount={stockInDetails.stockIn.totalPrice}
              closemodal={() => setIsModalOpen(false)}
            />
          </div>
        )}
      </div>
    </Admintemplate>
  );
}