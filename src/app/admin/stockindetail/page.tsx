import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StockInDetailAdd from "@/components/stockindetail/StockInDetailAdd2";

export default function StockInDetailPage() {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">นำเข้าสินค้า</CardTitle>
        </CardHeader>
        <CardContent>
          <StockInDetailAdd />
        </CardContent>
      </Card>
    </div>
  )
}