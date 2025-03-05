import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  ShoppingCart, 
  LogOut,
  FileOutput,
  FileInput
} from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">Hanashabu Admin</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          <li>
            <Link href="/admin/dashboard" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <LayoutDashboard className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link href="/admin/stock" className="flex items-center p-2 rounded-lg hover:bg-gray-100 bg-gray-100">
              <Package className="h-5 w-5 mr-3" />
              คลังสินค้า
            </Link>
          </li>
          <li>
            <Link href="/admin/stockin" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <FileInput className="h-5 w-5 mr-3" />
              นำเข้าสินค้า
            </Link>
          </li>
          <li>
            <Link href="/admin/stockout" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <FileOutput className="h-5 w-5 mr-3" />
              เบิกสินค้า
            </Link>
          </li>
          <li>
            <Link href="/admin/orders" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <ClipboardList className="h-5 w-5 mr-3" />
              คำสั่งซื้อ
            </Link>
          </li>
          <li>
            <Link href="/admin/products" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5 mr-3" />
              รายการอาหาร
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4 border-t">
        <button className="flex items-center text-red-500 p-2 w-full rounded-lg hover:bg-red-50">
          <LogOut className="h-5 w-5 mr-3" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
}