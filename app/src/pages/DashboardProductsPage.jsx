import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Plus, Package, Clock, 
  Globe, Tag, Edit, Trash2, CheckCircle2, XCircle, Sparkles, Building2
} from 'lucide-react';
import { dbStore } from '../lib/dbStore';
import { authService } from '../lib/authService';

export default function DashboardProductsPage({ setActivePage }) {
  const currentUser = authService.getCurrentUser();
  const slug = currentUser?.slug || 'profile';

  const [products, setProducts] = useState(() => dbStore.getProducts(slug));
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [moq, setMoq] = useState('');
  const [leadTime, setLeadTime] = useState('');

  useEffect(() => {
    const load = () => setProducts(dbStore.getProducts(slug));
    load();
    const unsub = dbStore.onSync(load);
    return () => unsub();
  }, [slug]);

  const handleAddProduct = (e) => {
    if (e) e.preventDefault();
    if (!productName.trim()) return;

    dbStore.addProduct(slug, {
      title: productName.trim(),
      category: category.trim() || 'General Product',
      description: description.trim() || 'Custom product or service package.',
      min_order_qty: moq.trim() || '1 unit',
      lead_time: leadTime.trim() || '7 days',
      price_range: "$100 - $500",
      image_url: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=400",
    });

    setProductName('');
    setCategory('');
    setDescription('');
    setMoq('');
    setLeadTime('');
  };

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 font-sans desk-grid-background">
      
      {/* Main Container */}
      <div className="dossier-card rounded-3xl p-4 sm:p-8 md:p-10 border-3 border-slate-900 shadow-[6px_6px_0px_0px_#0f172a] sm:shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#ffedd5] text-slate-900 space-y-5">

        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PRODUCT & SERVICE CATALOG</span>
        </div>

        {/* Title */}
        <div className="space-y-1 pt-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Products & Services Catalog
          </h1>
          <p className="text-xs font-bold text-slate-700">
            Manage your products, services, and offerings for backed.network/{slug}
          </p>
        </div>

        {/* Add Product Form */}
        <form onSubmit={handleAddProduct} className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a] space-y-4">
          <span className="text-xs font-mono font-black uppercase text-slate-900 block">
            Add a Product or Service
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Product or Service Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Custom Web Design Package or Precision Parts"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Category</label>
              <input
                type="text"
                placeholder="e.g. Design Services, Manufacturing, Software"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Minimum Order Quantity</label>
              <input
                type="text"
                placeholder="e.g. 1 unit, 10 pieces"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono font-bold block mb-1">Delivery Time</label>
              <input
                type="text"
                placeholder="e.g. 7 business days"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                className="w-full bg-white border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs font-bold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold block mb-1">Description *</label>
            <textarea
              rows={2}
              required
              placeholder="Describe this product or service in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white border-2 border-slate-900 rounded-xl p-3 text-xs font-bold focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Add Catalog Item</span>
          </button>
        </form>

        {/* Catalog Items */}
        <div className="space-y-3 pt-2">
          {products.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-900 text-center">
              <p className="text-xs font-bold text-slate-600">No B2B products or components cataloged yet. Add your first item above.</p>
            </div>
          ) : (
            products.map((prod) => (
              <div key={prod.id} className="bg-white p-5 rounded-2xl border-2 border-slate-900 shadow-[3px_3px_0px_0px_#0f172a] space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-slate-900">{prod.title || prod.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">{prod.lead_time}</span>
                    <button
                      type="button"
                      onClick={async () => {
                        await dbStore.deleteProduct(slug, prod.id);
                        setProducts(dbStore.getProducts(slug));
                      }}
                      className="p-1 rounded-lg border border-slate-300 text-slate-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                      title="Delete catalog product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">{prod.description || prod.short_description}</p>
                <div className="flex gap-4 text-xs font-mono font-bold text-slate-600 pt-1">
                  <span>MOQ: {prod.min_order_qty || prod.minimum_order || "10 units"}</span>
                  {prod.price_range && <span>Price: {prod.price_range}</span>}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}
