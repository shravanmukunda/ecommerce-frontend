'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_PROMO_CODES,
  CREATE_PROMO_CODE,
  DELETE_PROMO_CODE,
  TOGGLE_PROMO_CODE_STATUS,
} from '@/graphql/promo';

interface PromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit: number | null;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PromoCodesResponse {
  promoCodes: PromoCode[];
}

export default function AdminPromoCodesPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    validUntil: '',
    usageLimit: '',
  });

  const { data, loading, refetch } = useQuery<PromoCodesResponse>(GET_PROMO_CODES);
  
  const [createPromo] = useMutation(CREATE_PROMO_CODE, {
    onCompleted: () => {
      refetch();
      setShowForm(false);
      resetForm();
    },
  });

  const [deletePromo] = useMutation(DELETE_PROMO_CODE, {
    onCompleted: () => refetch(),
  });

  const [toggleStatus] = useMutation(TOGGLE_PROMO_CODE_STATUS, {
    onCompleted: () => refetch(),
  });

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      validUntil: '',
      usageLimit: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPromo({
      variables: {
        input: {
          code: formData.code,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue.toString()),
          validUntil: new Date(formData.validUntil).toISOString(),
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        },
      },
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promo Codes</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {showForm ? 'Cancel' : 'Create New'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Value ({formData.discountType === 'percentage' ? '%' : '₹'})
                </label>
                <input
                  type="number"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  max={formData.discountType === 'percentage' ? 100 : undefined}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valid Until</label>
                <input
                  type="datetime-local"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Usage Limit (optional)</label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  min="1"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-2 bg-green-500 text-white rounded"
            >
              Create Promo Code
            </button>
          </form>
        </div>
      )}

      {/* Promo Codes List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.promoCodes.map((promo: any) => (
              <tr key={promo.id}>
                <td className="px-6 py-4 font-mono font-bold">{promo.code}</td>
                <td className="px-6 py-4 capitalize">{promo.discountType}</td>
                <td className="px-6 py-4">
                  {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₹${promo.discountValue}`}
                </td>
                <td className="px-6 py-4">
                  {promo.usageCount} {promo.usageLimit && `/ ${promo.usageLimit}`}
                </td>
                <td className="px-6 py-4">
                  {new Date(promo.validUntil).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {promo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => toggleStatus({ variables: { id: promo.id } })}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Toggle
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this promo code?')) {
                        deletePromo({ variables: { id: promo.id } });
                      }
                    }}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
