'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Package,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import {
  MOCK_PRODUCTS,
  formatArth,
  ProductCategory,
} from '@/components/bank/BankMockData';
import { BankMaskedValue } from '@/components/bank/BankMaskedValue';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: string[] = [
    'all',
    'Savings Account',
    'Current Account',
    'FD Scheme',
    'Loan Product',
    'Transfer Service',
  ];

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      const matchesSearch =
        !searchQuery ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.eligibility.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || prod.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-serif font-bold text-2xl text-[#1C1736]">Product Catalogue</h1>
          <p className="text-sm text-[#74777F] mt-0.5">
            Institutional banking instruments, fee structures, interest yields, and limits
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3B3278] text-white text-xs font-bold hover:bg-[#2D2654] transition-colors shadow-sm cursor-pointer">
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Product</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#3B3278]/10 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#3B3278] text-white shadow-xs'
                  : 'text-[#74777F] hover:text-[#3B3278] hover:bg-[#3B3278]/5'
              }`}
            >
              {cat === 'all' ? 'All Products' : cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#74777F]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search product name or eligibility..."
            className="pl-9 pr-3 py-1.5 bg-[#FAFAFF] border border-[#3B3278]/15 rounded-xl text-xs outline-none focus:border-[#3B3278] focus:ring-2 focus:ring-[#3B3278]/15 w-64"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-2xl border border-[#3B3278]/10 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#3B3278]/30 transition group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-[#74777F] uppercase tracking-wider">
                    {prod.id}
                  </span>
                  <h3 className="font-serif font-bold text-lg text-[#1C1736] group-hover:text-[#3B3278] transition-colors">
                    {prod.name}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    prod.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {prod.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#3B3278]/8 text-[#3B3278] text-[11px] font-mono font-medium">
                {prod.category}
              </span>

              <p className="text-xs text-[#74777F] line-clamp-2 leading-relaxed">
                {prod.description}
              </p>

              {/* Specs Box */}
              <div className="p-3 rounded-xl bg-[#FAFAFF] border border-[#3B3278]/8 text-xs font-mono space-y-1.5">
                {prod.interestRate !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#74777F]">Interest Rate:</span>
                    <strong className="text-emerald-700 font-bold">{prod.interestRate}% p.a.</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#74777F]">Standard Fee:</span>
                  <strong className="text-[#1C1736]">
                    {prod.fees === 0 ? 'Free' : `${formatArth(prod.fees)} ARTH`}
                  </strong>
                </div>
                {prod.minBalance !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#74777F]">Min Balance:</span>
                    <strong className="text-[#1C1736]">{formatArth(prod.minBalance)} ARTH</strong>
                  </div>
                )}
                {prod.maxLimit !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-[#74777F]">Max Limit:</span>
                    <strong className="text-[#1C1736]">{formatArth(prod.maxLimit)} ARTH</strong>
                  </div>
                )}
                <div className="flex justify-between pt-1 border-t border-[#3B3278]/6 text-[11px]">
                  <span className="text-[#74777F]">Eligibility:</span>
                  <span className="text-[#1C1736] text-right truncate max-w-[140px]" title={prod.eligibility}>
                    {prod.eligibility}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#3B3278]/8 flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-[#74777F]">
                <Users className="w-3.5 h-3.5 text-[#3B3278]" />
                <span>{prod.customerCount} Citizens Enrolled</span>
              </div>
              <Link
                href={`/bank/products/${prod.id}`}
                className="px-3 py-1.5 rounded-lg bg-[#FAFAFF] hover:bg-[#F4F2FF] text-[#3B3278] font-bold border border-[#3B3278]/15 text-xs transition inline-flex items-center gap-1"
              >
                <span>Configure</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
