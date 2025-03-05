"use client"
import Admintemplate from "@/components/Admintemplate"
import { Button } from "@/components/ui/button"
import { RiAddLargeLine, RiSearchLine } from "react-icons/ri";
import { LuRefreshCw } from "react-icons/lu";
import { useState, useEffect } from 'react';
import ModalAddProduct from "@/components/ModalAddProduct";
import ModalAddIngre from "@/components/ModalAddIngre";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function Stockpage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // เรียกใช้ API เพื่อดึงข้อมูลสต็อก
      const response = await fetch(`/api/stock?search=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    fetchProducts(); // รีเฟรชข้อมูลหลังจากเพิ่มสินค้า
  };

  const handleOpenModal2 = () => {
    setIsModalOpen2(true);
  };

  const handleCloseModal2 = () => {
    setIsModalOpen2(false);
    fetchProducts(); // รีเฟรชข้อมูลหลังจากเพิ่มวัตถุดิบ
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  function getStatusClass(status) {
    if (status === "เหลือน้อย") return "bg-red-200";
    return "bg-green-200";
  }

  return (
    <Admintemplate>
      <div className='size-full p-10 flex items-center justify-center'>
        <div className='bg-white size-full rounded-3xl'>
          <div className="mt-5 w-full h-[100px] flex flex-col justify-center px-6 sm:flex-row sm:h-[70px] sm:items-center sm:justify-between">
            <p className="text-3xl">คลังสินค้า</p>
            <div className="flex">
              <Button className="py-2 px-4 mr-2 rounded bg-[#FFB8DA] hover:bg-[#fcc6e0]" onClick={handleOpenModal2}><RiAddLargeLine/> เพิ่มวัตถุดิบใหม่</Button>            
              <Button variant="outline" onClick={handleRefresh}><LuRefreshCw /> รีเฟรช</Button>
            </div>
          </div>
          
          <div className="w-full h-[70px] flex items-center justify-center">
            <div className="relative w-full px-6 flex items-center justify-center">
              <input
                type="text"
                placeholder="ค้นหาสินค้า..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <RiSearchLine className="absolute left-9 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <div className="mt-2 w-full px-6">
            {loading ? (
              <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
            ) : (
              <div className="border rounded-md overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">รหัสสินค้า</TableHead>
                      <TableHead className="w-[150px] md:w-[200px]">ชื่อสินค้า</TableHead>
                      <TableHead className="w-[100px] text-right">คงเหลือ</TableHead>
                      <TableHead className="w-[75px] text-right">หน่วย</TableHead>
                      <TableHead className="w-[75px] text-right">ขั้นต่ำ</TableHead>
                      <TableHead className="w-[150px] text-center">สถานะ</TableHead>
                      <TableHead className="w-[150px] md:w-[200px] text-right">อัปเดตล่าสุด</TableHead>
                      <TableHead className="w-[160px] text-right">การจัดการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const status = product.Quantity <= product.minQuantity ? "เหลือน้อย" : "ปกติ";
                      return (
                        <TableRow key={product.stockID}>
                          <TableCell className="font-medium">{product.stockID}</TableCell>
                          <TableCell>{product.ingredientName}</TableCell>
                          <TableCell className="text-right">{product.Quantity}</TableCell>
                          <TableCell className="text-right">{product.Unit}</TableCell>
                          <TableCell className="text-right">{product.minQuantity}</TableCell>
                          <TableCell className="text-center"> 
                            <span className={`px-8 py-2 rounded-full ${getStatusClass(status)}`}>
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {new Date(product.LastUpdated).toLocaleString('th-TH')}
                          </TableCell>
                          <TableCell className="flex items-center justify-around lg:justify-end">
                            <Button className="lg:mr-2 bg-[#FFC107] hover:bg-[#ffd044]">แก้ไข</Button>
                            <Button variant="destructive">ลบ</Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <ModalAddProduct closemodal={handleCloseModal}/>
            </div>
          )}
          
          {isModalOpen2 && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <ModalAddIngre closemodal={handleCloseModal2}/>
            </div>
          )}
        </div>
      </div>
    </Admintemplate>
  )
}

export default Stockpage