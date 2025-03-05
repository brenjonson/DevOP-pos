"use client"

import Admintemplate from "@/components/Admintemplate";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from 'react';
import { outStock, fetchEmployee, fetchStock } from "@/actions/actions"; // นำเข้าฟังก์ชันที่จำเป็น
import { toast } from 'sonner'; // ถ้าคุณมี sonner ติดตั้งไว้แล้ว
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function AddStockOutPage() {
  const [empID, setEmpID] = useState('');
  const [stockID, setStockID] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State สำหรับเก็บรายการพนักงานและสต็อก
  const [employees, setEmployees] = useState([]);
  const [stocks, setStocks] = useState([]);

  // โหลดข้อมูลพนักงานและสต็อกเมื่อหน้าถูกโหลด
  useEffect(() => {
    async function loadData() {
      try {
        // ดึงข้อมูลพนักงาน
        const empData = await fetchEmployee();
        setEmployees(empData);
        
        // ดึงข้อมูลสต็อก
        const stockData = await fetchStock();
        setStocks(stockData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }
    
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!empID || !stockID || !quantity || !unit) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('empID', empID);
      formData.append('stockID', stockID);
      formData.append('quantity', quantity);
      formData.append('unit', unit);
      formData.append('note', note);
      
      // เรียกใช้ฟังก์ชัน outStock
      const result = await outStock(formData);
      
      // แสดงแจ้งเตือนสำเร็จ
      if (toast) {
        toast.success('บันทึกการเบิกของสำเร็จ');
      } else {
        alert('บันทึกการเบิกของสำเร็จ');
      }
      
      // รีเซ็ตฟอร์ม
      setEmpID('');
      setStockID('');
      setQuantity('');
      setUnit('');
      setNote('');
      
    } catch (error) {
      if (toast) {
        toast.error(`เกิดข้อผิดพลาด: ${error.message}`);
      } else {
        alert(`เกิดข้อผิดพลาด: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Admintemplate>
      <div className='size-full p-5 md:p-10 flex items-center justify-center'>
        <div className='bg-white size-full rounded-3xl'>
          <div className="h-[100px] flex items-center justify-center">
            <p className="text-3xl">บันทึกการเบิกของ</p>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="w-[50%] h-[4px] bg-[#FFB8DA] rounded-full"></div>
          </div>

          <div className="w-full flex mt-10 justify-center h-[80%]">
            <div className="px-3 w-full md:w-3/5">
              <Card>
                <CardHeader>
                  <CardTitle>ฟอร์มบันทึกการเบิกของ</CardTitle>
                  <CardDescription>กรอกข้อมูลให้ครบถ้วนเพื่อบันทึกการเบิกของ</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 mt-5'>
                      <div>
                        <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
                          พนักงาน
                        </label>
                        <Select value={empID} onValueChange={setEmpID}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกพนักงาน" />
                          </SelectTrigger>
                          <SelectContent>
                            {employees.map((employee) => (
                              <SelectItem key={employee.empID} value={employee.empID.toString()}>
                                {employee.empFname} {employee.empLname}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label htmlFor="stockID" className="block text-sm font-medium text-gray-700 mb-1">
                          วัตถุดิบ
                        </label>
                        <Select value={stockID} onValueChange={setStockID}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกวัตถุดิบ" />
                          </SelectTrigger>
                          <SelectContent>
                            {stocks.map((stock) => (
                              <SelectItem key={stock.stockID} value={stock.stockID.toString()}>
                                {stock.ingredientName} (คงเหลือ: {stock.Quantity} {stock.Unit})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end">
                      <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                          จำนวน
                        </label>
                        <input
                          type="number"
                          id="quantity"
                          placeholder="ระบุจำนวน"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                        />
                      </div>

                      <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                          หน่วย
                        </label>
                        <Select value={unit} onValueChange={setUnit}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกหน่วย..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ชิ้น">ชิ้น</SelectItem>
                            <SelectItem value="กิโลกรัม">กิโลกรัม</SelectItem>
                            <SelectItem value="แพ็ค">แพ็ค</SelectItem>
                            <SelectItem value="ลิตร">ลิตร</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                        หมายเหตุ
                      </label>
                      <Textarea 
                        placeholder="เพิ่มหมายเหตุ (ถ้ามี)" 
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
                      <Button 
                        className="w-full h-[40px] bg-[#FFB8DA] hover:bg-[#fcc6e0]" 
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการเบิก'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-[40px]" 
                        onClick={() => {
                          setEmpID('');
                          setStockID('');
                          setQuantity('');
                          setUnit('');
                          setNote('');
                        }}
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Admintemplate>
  );
}

export default AddStockOutPage;