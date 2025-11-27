import { PromoCodeManagement } from "@/components/admin/promo-code-management"

export default function TestPromoPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-wider mb-8">Promo Code Management Test</h1>
      <PromoCodeManagement />
    </div>
  )
}