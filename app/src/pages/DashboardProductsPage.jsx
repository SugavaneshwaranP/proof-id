import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, ArrowRight, Paperclip, Plus, Package, Clock, 
  Globe, Tag, Edit, Trash2, CheckCircle2, XCircle, Sparkles, Building2
} from 'lucide-react';

export default function DashboardProductsPage({ setActivePage }) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [moq, setMoq] = useState('');
  const [leadTime, setLeadTime] = useState('');
  const [privateLabel, setPrivateLabel] = useState('Yes');
  const [exportReady, setExportReady] = useState('Yes');

  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Custom High-Precision CNC Machined Parts',
      category: 'Manufacturing & Hardware',
      description: 'Aerospace-grade aluminum and stainless steel CNC components built to tight ISO 9001 tolerances.',
      moq: '50 units',
      leadTime: '14 business days',
      privateLabel: 'Yes',
      exportReady: 'Yes'
    },
    {
      id: 2,
      name: 'Eco-Friendly Recyclable Packaging Sets',
      category: 'Sustainable Packaging',
      description: 'FSC-certified biodegradable corrugated boxes with custom soy-ink printing for direct food contact.',
      moq: '500 units',
      leadTime: '7 business days',
      privateLabel: 'Yes',
      exportReady: 'Yes'
    }
  ]);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!productName || !category || !description) return;

    const newProd = {
      id: Date.now(),
      name: productName,
      category,
      description,
      moq: moq || '10 units',
      leadTime: leadTime || '7 days',
      privateLabel,
      exportReady
    };

    setProducts([newProd, ...products]);
    setProductName('');
    setCategory('');
    setDescription('');
    setMoq('');
    setLeadTime('');
    setPrivateLabel('Yes');
    setExportReady('Yes');
  };

  const handleRemoveProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 font-sans desk-grid-background">
      
      {/* Main Tactile Dossier Container */}
      <div className="dossier-card rounded-3xl p-6 sm:p-10 border-3 border-slate-900 shadow-[8px_8px_0px_0px_#0f172a] relative overflow-hidden bg-[#a7f3d0] text-slate-900">
        
        {/* Top Metallic Clip */}
        <div className="dossier-clip">
          <Paperclip className="w-3.5 h-3.5 text-amber-300" />
          <span>PRODUCTS & SERVICES DOSSIER</span>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900/60">
          <span className="pill-header inline-block text-xs font-mono bg-amber-300 text-slate-900">
            Offerings & Capacity
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-1">
            “Your products & services”
          </h1>
          <p className="text-sm font-extrabold text-slate-800">
            What you make, what it takes to get it, and who it’s for.
          </p>
        </div>

        {/* Add-New Form */}
        <form onSubmit={handleAddProduct} className="space-y-4 pt-6 bg-white p-5 sm:p-6 rounded-2xl border-3 border-slate-900 shadow-[4px_4px_0px_0px_#0f172a]">
          <div className="text-xs font-mono font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>ADD NEW PRODUCT OR SERVICE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">
                Product name
              </label>
              <input
                type="text"
                required
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="What it’s called"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">
                Category
              </label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Where it fits (e.g. Hardware, Packaging)"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-900 block">
              Description
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short, honest summary"
              className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Minimum Order */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">
                Minimum order (MOQ)
              </label>
              <input
                type="text"
                value={moq}
                onChange={(e) => setMoq(e.target.value)}
                placeholder="Smallest order you’ll take (e.g. 50 units)"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>

            {/* Lead Time */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-900 block">
                Lead time
              </label>
              <input
                type="text"
                value={leadTime}
                onChange={(e) => setLeadTime(e.target.value)}
                placeholder="How long it takes (e.g. 10 business days)"
                className="w-full bg-slate-50 border-2 border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-[2px_2px_0px_0px_#0f172a]"
              />
            </div>
          </div>

          {/* Toggle Options: Private Label & Export Ready */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Private Label Toggle */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <label className="text-xs font-bold text-slate-900 block">
                Private label?
              </label>
              <div className="flex items-center gap-3 pt-1">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-slate-900">
                    <input
                      type="radio"
                      name="privateLabel"
                      value={opt}
                      checked={privateLabel === opt}
                      onChange={(e) => setPrivateLabel(e.target.value)}
                      className="accent-slate-900"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Export Ready Toggle */}
            <div className="space-y-1 bg-slate-50 p-3 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <label className="text-xs font-bold text-slate-900 block">
                Export ready?
              </label>
              <div className="flex items-center gap-3 pt-1">
                {['Yes', 'No'].map((opt) => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer text-xs font-black text-slate-900">
                    <input
                      type="radio"
                      name="exportReady"
                      value={opt}
                      checked={exportReady === opt}
                      onChange={(e) => setExportReady(e.target.value)}
                      className="accent-slate-900"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Add Product Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_#059669] border-2 border-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>Add product</span>
          </button>
        </form>

        {/* Product Grid & Empty State */}
        <div className="pt-8 space-y-4">
          <div className="text-xs font-mono font-black text-slate-900 uppercase">
            PRODUCT CATALOG ({products.length})
          </div>

          {products.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-slate-900 text-center space-y-2">
              <Package className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-sm font-black text-slate-900">Nothing listed yet.</p>
              <p className="text-xs font-bold text-slate-700">Add your first product so buyers know what you offer.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {products.map((prod) => (
                  <motion.div
                    key={prod.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white p-5 rounded-2xl border-3 border-slate-900 shadow-[5px_5px_0px_0px_#0f172a] space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-black uppercase text-slate-900 bg-amber-200 px-2 py-0.5 rounded-md border border-slate-900">
                          {prod.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-mono font-black">
                          {prod.exportReady === 'Yes' && (
                            <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md border border-slate-900 flex items-center gap-1">
                              <Globe className="w-3 h-3" /> Export Ready
                            </span>
                          )}
                        </div>
                      </div>

                      <h4 className="text-base font-black text-slate-900 tracking-tight">{prod.name}</h4>
                      <p className="text-xs font-extrabold text-slate-700 leading-relaxed">{prod.description}</p>

                      <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono font-bold border-t-2 border-slate-900/10">
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">MIN ORDER</span>
                          <span className="text-slate-900 font-black">{prod.moq}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500 block uppercase">LEAD TIME</span>
                          <span className="text-slate-900 font-black">{prod.leadTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t-2 border-slate-900/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono font-black text-slate-700">
                        Private Label: <span className="text-emerald-800">{prod.privateLabel}</span>
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProductName(prod.name);
                            setCategory(prod.category);
                            setDescription(prod.description);
                            setMoq(prod.moq);
                            setLeadTime(prod.leadTime);
                            setPrivateLabel(prod.privateLabel);
                            setExportReady(prod.exportReady);
                            handleRemoveProduct(prod.id);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-slate-900 text-xs font-bold hover:bg-slate-100 text-slate-800 flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(prod.id)}
                          className="px-2.5 py-1 rounded-lg border border-red-900 text-xs font-bold hover:bg-red-50 text-red-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
