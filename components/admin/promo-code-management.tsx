"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  GET_PROMO_CODES, 
  CREATE_PROMO_CODE, 
  UPDATE_PROMO_CODE, 
  DELETE_PROMO_CODE,
  TOGGLE_PROMO_CODE_STATUS 
} from "@/graphql/promo"

interface PromoCode {
  id: string
  code: string
  discountType: "percentage" | "fixed"
  discountValue: number
  validFrom?: string
  validUntil: string
  isActive: boolean
  usageLimit?: number
  usageCount?: number
}

interface GetPromoCodesResponse {
  promoCodes: PromoCode[]
}

export function PromoCodeManagement() {
  // Try to fetch promo codes from backend
  const { data, loading, error, refetch } = useQuery<GetPromoCodesResponse>(GET_PROMO_CODES, {
    variables: { isActive: null },
    fetchPolicy: "network-only"
  })
  
  const [createPromoCode, { loading: creating }] = useMutation(CREATE_PROMO_CODE)
  const [updatePromoCode, { loading: updating }] = useMutation(UPDATE_PROMO_CODE)
  const [deletePromoCode, { loading: deleting }] = useMutation(DELETE_PROMO_CODE)
  const [toggleStatus] = useMutation(TOGGLE_PROMO_CODE_STATUS)
  
  // Fallback to local state if backend doesn't support promo codes yet
  const [localPromoCodes, setLocalPromoCodes] = useState<PromoCode[]>([
    {
      id: "1",
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      validUntil: "2024-12-31T23:59",
      isActive: true
    },
    {
      id: "2",
      code: "SAVE20",
      discountType: "fixed",
      discountValue: 20,
      validUntil: "2024-11-30T23:59",
      isActive: true
    }
  ])
  
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    validUntil: ""
  })
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PromoCode>>({})
  
  // Determine if we're using backend or local data
  const useBackend = !error && data?.promoCodes
  const promoCodes = useBackend ? data.promoCodes : localPromoCodes

  const handleAddPromoCode = async () => {
    if (!newPromoCode.code || !newPromoCode.validUntil) return
    
    if (useBackend) {
      try {
        await createPromoCode({
          variables: {
            input: {
              code: newPromoCode.code,
              discountType: newPromoCode.discountType,
              discountValue: newPromoCode.discountValue,
              validUntil: newPromoCode.validUntil,
              isActive: true
            }
          }
        })
        await refetch()
        setNewPromoCode({
          code: "",
          discountType: "percentage",
          discountValue: 0,
          validUntil: ""
        })
      } catch (err) {
        console.error("Failed to create promo code:", err)
        alert("Failed to create promo code. Check console for details.")
      }
    } else {
      // Fallback to local state
      const promoCode: PromoCode = {
        id: Date.now().toString(),
        code: newPromoCode.code,
        discountType: newPromoCode.discountType,
        discountValue: newPromoCode.discountValue,
        validUntil: newPromoCode.validUntil,
        isActive: true
      }
      
      setLocalPromoCodes([...localPromoCodes, promoCode])
      setNewPromoCode({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        validUntil: ""
      })
    }
  }
  
  const handleEditPromoCode = (id: string) => {
    setEditingId(id)
    const promoCode = promoCodes.find((code: PromoCode) => code.id === id)
    if (promoCode) {
      setEditForm({ ...promoCode })
    }
  }
  
  const handleSaveEdit = async () => {
    if (!editingId) return
    
    if (useBackend) {
      try {
        await updatePromoCode({
          variables: {
            id: editingId,
            input: {
              code: editForm.code!,
              discountType: editForm.discountType!,
              discountValue: editForm.discountValue!,
              validUntil: editForm.validUntil!,
              isActive: editForm.isActive
            }
          }
        })
        await refetch()
        setEditingId(null)
        setEditForm({})
      } catch (err) {
        console.error("Failed to update promo code:", err)
        alert("Failed to update promo code. Check console for details.")
      }
    } else {
      setLocalPromoCodes(localPromoCodes.map(code => 
        code.id === editingId ? { ...code, ...editForm } as PromoCode : code
      ))
      setEditingId(null)
      setEditForm({})
    }
  }
  
  const handleDeletePromoCode = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promo code?")) return
    
    if (useBackend) {
      try {
        await deletePromoCode({
          variables: { id }
        })
        await refetch()
      } catch (err) {
        console.error("Failed to delete promo code:", err)
        alert("Failed to delete promo code. Check console for details.")
      }
    } else {
      setLocalPromoCodes(localPromoCodes.filter(code => code.id !== id))
    }
  }
  
  const toggleActiveStatus = async (id: string) => {
    if (useBackend) {
      try {
        await toggleStatus({
          variables: { id }
        })
        await refetch()
      } catch (err) {
        console.error("Failed to toggle promo code status:", err)
        alert("Failed to toggle status. Check console for details.")
      }
    } else {
      setLocalPromoCodes(localPromoCodes.map(code => 
        code.id === id ? { ...code, isActive: !code.isActive } : code
      ))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promo Code Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Backend status alert */}
        {error && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Backend promo code API not available. Using local mock data. 
              Error: {error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {loading && (
          <div className="text-center py-8">
            <p>Loading promo codes...</p>
          </div>
        )}
        {/* Add New Promo Code Form */}
        <div className="mb-8 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Add New Promo Code</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={newPromoCode.code}
                onChange={(e) => setNewPromoCode({...newPromoCode, code: e.target.value})}
                placeholder="e.g., SAVE10"
              />
            </div>
            
            <div>
              <Label htmlFor="discountType">Discount Type</Label>
              <select
                id="discountType"
                value={newPromoCode.discountType}
                onChange={(e) => setNewPromoCode({...newPromoCode, discountType: e.target.value as "percentage" | "fixed"})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                value={newPromoCode.discountValue}
                onChange={(e) => setNewPromoCode({...newPromoCode, discountValue: Number(e.target.value)})}
                placeholder="e.g., 10"
              />
            </div>
            
            <div>
              <Label htmlFor="validUntil">Validity Date</Label>
              <Input
                id="validUntil"
                type="datetime-local"
                value={newPromoCode.validUntil}
                onChange={(e) => setNewPromoCode({...newPromoCode, validUntil: e.target.value})}
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={handleAddPromoCode} className="w-full" disabled={creating || loading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                {creating ? "Adding..." : "Add Code"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Promo Codes Table */}
        {!loading && (
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Validity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promoCodes && promoCodes.length > 0 ? (
              promoCodes.map((promoCode: PromoCode) => (
              <TableRow key={promoCode.id}>
                {editingId === promoCode.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editForm.code || ""}
                        onChange={(e) => setEditForm({...editForm, code: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <select
                          value={editForm.discountType || ""}
                          onChange={(e) => setEditForm({...editForm, discountType: e.target.value as "percentage" | "fixed"})}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">$</option>
                        </select>
                        <Input
                          type="number"
                          value={editForm.discountValue || 0}
                          onChange={(e) => setEditForm({...editForm, discountValue: Number(e.target.value)})}
                          className="w-20"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="datetime-local"
                        value={editForm.validUntil || ""}
                        onChange={(e) => setEditForm({...editForm, validUntil: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <select
                        value={editForm.isActive ? "active" : "inactive"}
                        onChange={(e) => setEditForm({...editForm, isActive: e.target.value === "active"})}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button onClick={handleSaveEdit} size="sm" className="mr-2">
                        Save
                      </Button>
                      <Button onClick={() => setEditingId(null)} variant="outline" size="sm">
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium">{promoCode.code}</TableCell>
                    <TableCell>
                      {promoCode.discountType === "percentage" 
                        ? `${promoCode.discountValue}%` 
                        : `$${promoCode.discountValue}`}
                    </TableCell>
                    <TableCell>
                      {new Date(promoCode.validUntil).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        promoCode.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {promoCode.isActive ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        onClick={() => toggleActiveStatus(promoCode.id)} 
                        variant="outline" 
                        size="sm" 
                        className="mr-2"
                      >
                        {promoCode.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button 
                        onClick={() => handleEditPromoCode(promoCode.id)} 
                        variant="ghost" 
                        size="sm"
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={() => handleDeletePromoCode(promoCode.id)} 
                        variant="ghost" 
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  No promo codes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      </CardContent>
    </Card>
  )
}