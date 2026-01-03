"use client"

import { useState } from "react"
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
  isActive: boolean
}

interface GetPromoCodesResponse {
  promoCodes: PromoCode[]
}

// Mock data for when backend is unavailable
const MOCK_PROMO_CODES: PromoCode[] = [
  {
    id: "1",
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    isActive: true,
  },
  {
    id: "2",
    code: "SAVE50",
    discountType: "fixed",
    discountValue: 50,
    isActive: true,
  },
]

export function PromoCodeManagement() {
  const { data, loading, error, refetch } = useQuery<GetPromoCodesResponse>(
    GET_PROMO_CODES,
    { 
      fetchPolicy: "network-only",
      errorPolicy: "all" // Allow partial data even if query fails
    }
  )

  const [createPromoCode, { loading: creating }] = useMutation(CREATE_PROMO_CODE)
  const [updatePromoCode] = useMutation(UPDATE_PROMO_CODE)
  const [deletePromoCode] = useMutation(DELETE_PROMO_CODE)
  const [toggleStatus] = useMutation(TOGGLE_PROMO_CODE_STATUS)

  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
  })

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<PromoCode>>({})
  const [localPromos, setLocalPromos] = useState<PromoCode[]>(MOCK_PROMO_CODES)

  // Use backend data if available, otherwise use local mock data
  const promoCodes = data?.promoCodes || localPromos

  const handleAddPromoCode = async () => {
    if (!newPromoCode.code || newPromoCode.discountValue <= 0) {
      alert("Please fill in all fields")
      return
    }

    try {
      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)

      // Try to create via backend
      if (!error) {
        const result = await createPromoCode({
          variables: {
            input: {
              code: newPromoCode.code,
              discountType: newPromoCode.discountType,
              discountValue: newPromoCode.discountValue,
              validUntil: futureDate.toISOString(),
            },
          },
        })

        if (result.data && typeof result.data === 'object' && 'createPromoCode' in result.data) {
          const createPromoCodeData = (result.data as any).createPromoCode
          if (createPromoCodeData?.id) {
            await refetch()
            setNewPromoCode({
              code: "",
              discountType: "percentage",
              discountValue: 0,
            })
            alert("Promo code created successfully!")
            return
          }
        }
      }

      // Fallback: add to local state if backend unavailable
      const newId = String(Date.now())
      const newPromo: PromoCode = {
        id: newId,
        code: newPromoCode.code.toUpperCase(),
        discountType: newPromoCode.discountType,
        discountValue: newPromoCode.discountValue,
        isActive: true,
      }
      setLocalPromos([...localPromos, newPromo])
      setNewPromoCode({
        code: "",
        discountType: "percentage",
        discountValue: 0,
      })
      alert("Promo code added (local storage - backend unavailable)")
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      
      // Fallback: add to local state on error
      const newId = String(Date.now())
      const newPromo: PromoCode = {
        id: newId,
        code: newPromoCode.code.toUpperCase(),
        discountType: newPromoCode.discountType,
        discountValue: newPromoCode.discountValue,
        isActive: true,
      }
      setLocalPromos([...localPromos, newPromo])
      setNewPromoCode({
        code: "",
        discountType: "percentage",
        discountValue: 0,
      })
      alert("Promo code added (local storage - backend error: " + errorMsg + ")")
    }
  }

  const handleEditPromoCode = (id: string) => {
    const promo = promoCodes.find(p => p.id === id)
    if (!promo) return

    setEditingId(id)
    setEditForm({
      ...promo,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editForm.code || !editForm.discountValue) {
      alert("Please fill in all fields")
      return
    }

    try {
      // Try backend first
      if (!error) {
        await updatePromoCode({
          variables: {
            id: editingId,
            input: {
              code: editForm.code,
              discountType: editForm.discountType,
              discountValue: editForm.discountValue,
            },
          },
        })
        await refetch()
        setEditingId(null)
        setEditForm({})
        return
      }

      // Fallback: update local state
      setLocalPromos(localPromos.map(p => 
        p.id === editingId 
          ? { ...p, ...editForm }
          : p
      ))
      setEditingId(null)
      setEditForm({})
      alert("Promo code updated (local storage)")
    } catch (err: unknown) {
      // Fallback: update local state on error
      setLocalPromos(localPromos.map(p => 
        p.id === editingId 
          ? { ...p, ...editForm }
          : p
      ))
      setEditingId(null)
      setEditForm({})
      alert("Promo code updated (local storage - backend error)")
    }
  }

  const handleDeletePromoCode = async (id: string) => {
    if (!confirm("Delete promo code?")) return
    
    try {
      // Try backend first
      if (!error) {
        await deletePromoCode({ variables: { id } })
        await refetch()
        return
      }

      // Fallback: delete from local state
      setLocalPromos(localPromos.filter(p => p.id !== id))
      alert("Promo code deleted (local storage)")
    } catch (err: unknown) {
      // Fallback: delete from local state on error
      setLocalPromos(localPromos.filter(p => p.id !== id))
      alert("Promo code deleted (local storage - backend error)")
    }
  }

  const toggleActiveStatus = async (id: string) => {
    try {
      // Try backend first
      if (!error) {
        await toggleStatus({ variables: { id } })
        await refetch()
        return
      }

      // Fallback: toggle in local state
      setLocalPromos(localPromos.map(p =>
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ))
    } catch (err: unknown) {
      // Fallback: toggle in local state on error
      setLocalPromos(localPromos.map(p =>
        p.id === id ? { ...p, isActive: !p.isActive } : p
      ))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Promo Code Management</CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Backend unavailable:</strong> Using local storage. Changes won't persist after refresh.
              <details className="mt-2 text-xs">
                <summary>Error details</summary>
                <pre className="mt-1 bg-yellow-100 p-2 rounded overflow-auto">
                  {error.message}
                </pre>
              </details>
            </AlertDescription>
          </Alert>
        )}

        {loading && !data && (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading promo codes...</p>
          </div>
        )}

        {/* ADD PROMO */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-4">Add New Promo Code</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Code</Label>
              <Input
                value={newPromoCode.code}
                onChange={e =>
                  setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })
                }
                placeholder="e.g., SAVE20"
              />
            </div>

            <div>
              <Label>Type</Label>
              <select
                value={newPromoCode.discountType}
                onChange={e =>
                  setNewPromoCode({
                    ...newPromoCode,
                    discountType: e.target.value as "percentage" | "fixed"
                  })
                }
                className="w-full border rounded px-2 py-2"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <div>
              <Label>Value ({newPromoCode.discountType === "percentage" ? "%" : "₹"})</Label>
              <Input
                type="number"
                value={newPromoCode.discountValue}
                onChange={e =>
                  setNewPromoCode({
                    ...newPromoCode,
                    discountValue: Number(e.target.value)
                  })
                }
                placeholder="0"
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddPromoCode} disabled={creating || loading}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Code
              </Button>
            </div>
          </div>
        </div>

        {/* PROMO TABLE */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {promoCodes.map(promo => (
              <TableRow key={promo.id}>
                {editingId === promo.id ? (
                  <>
                    <TableCell>
                      <Input
                        value={editForm.code || ""}
                        onChange={e =>
                          setEditForm({ ...editForm, code: e.target.value.toUpperCase() })
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <select
                          value={editForm.discountType || "percentage"}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              discountType: e.target.value as "percentage" | "fixed"
                            })
                          }
                          className="border rounded px-2 py-1 w-24"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">₹</option>
                        </select>
                        <Input
                          type="number"
                          value={editForm.discountValue || 0}
                          onChange={e =>
                            setEditForm({
                              ...editForm,
                              discountValue: Number(e.target.value)
                            })
                          }
                          className="w-20"
                        />
                      </div>
                    </TableCell>

                    <TableCell>
                      <Button onClick={handleSaveEdit} size="sm">
                        Save
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{promo.code}</TableCell>
                    <TableCell>
                      {promo.discountType === "percentage"
                        ? `${promo.discountValue}%`
                        : `₹${promo.discountValue}`}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActiveStatus(promo.id)}
                      >
                        {promo.isActive ? "Active" : "Inactive"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => handleEditPromoCode(promo.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDeletePromoCode(promo.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
