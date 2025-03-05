"use client"

import { Button } from './ui/button';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addStock } from '@/actions/actions'; // นำเข้าฟังก์ชัน addStock
import Swal from 'sweetalert2'; // ถ้าใช้ Sweetalert2

interface ModalAddIngreProps {
    closemodal: () => void;
}

function ModalAddIngre({ closemodal }: ModalAddIngreProps) {
    const [ingredientName, setIngredientName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('');
    const [price, setPrice] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!ingredientName || !quantity || !unit || !price) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน');
            return;
        }

        try {
            setLoading(true);
            
            const formData = new FormData();
            formData.append('ingredientName', ingredientName);
            formData.append('quantity', quantity);
            formData.append('unit', unit);
            formData.append('price', price);
            formData.append('minQuantity', minQuantity || '0');
            
            // เรียกใช้ฟังก์ชัน addStock จาก actions
            await addStock(formData);
            
            alert('เพิ่มวัตถุดิบใหม่สำเร็จ');
            closemodal();
            
        } catch (error) {
            alert(`เกิดข้อผิดพลาด: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-[600px] h-auto border-2 rounded-xl p-6 bg-white">
            <div className="w-full h-[60px] flex items-center">
                <p className="text-3xl">เพิ่มวัตถุดิบใหม่</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className='mt-5'>
                    <div className="mb-4 ">
                        <label htmlFor="ingredientName" className="block text-sm font-medium text-gray-700">
                            ชื่อวัตถุดิบ
                        </label>
                        <input
                            type="text"
                            id="ingredientName"
                            placeholder='กรอกชื่อวัตถุดิบ'
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                            value={ingredientName}
                            onChange={(e) => setIngredientName(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 items-end">
                    <div>
                        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                            จำนวน
                        </label>
                        <input
                            type="number"
                            id="quantity"
                            placeholder="0"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                            หน่วย
                        </label>
                        <Select value={unit} onValueChange={setUnit}>
                            <SelectTrigger className="w-full h-[40px]">
                                <SelectValue placeholder="เลือกหน่วย..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ชิ้น">ชิ้น</SelectItem>
                                <SelectItem value="กิโลกรัม">กิโลกรัม</SelectItem>
                                <SelectItem value="กรัม">กรัม</SelectItem>
                                <SelectItem value="ลิตร">ลิตร</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 items-end">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            ราคาต่อหน่วย (บาท)
                        </label>
                        <input
                            type="number"
                            id="price"
                            placeholder="0.00"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700">
                            จำนวนขั้นต่ำ
                        </label>
                        <input
                            type="number"
                            id="minQuantity"
                            placeholder="0"
                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-[#FFB8DA] focus:border-[#FFB8DA] sm:text-sm"
                            value={minQuantity}
                            onChange={(e) => setMinQuantity(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-10">
                    <Button 
                        type="submit" 
                        className="w-full h-[40px] bg-[#FFB8DA] hover:bg-[#fcc6e0]"
                        disabled={loading}
                    >
                        {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full h-[40px]" 
                        onClick={closemodal}
                    >
                        ยกเลิก
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default ModalAddIngre;