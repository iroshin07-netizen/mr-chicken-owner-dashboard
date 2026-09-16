import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Make sure this path matches your project
import { Clock, Trash2, Plus, Tag } from 'lucide-react';

export default function Deals() {
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- STANDARD OFFER FORM STATE ---
  const [form, setForm] = useState({
    title: "",
    discount_type: "flat",
    discount_value: "",
    item_ids: "",
    start_time: "",
    end_time: "",
    banner_url: "",
    banner_file: null
  });

  // --- COMBO OFFER FORM STATE ---
  const [comboForm, setComboForm] = useState({
    title: "",
    combo_price: "",
    start_time: "",
    end_time: "",
    banner_file: null
  });
  const [comboItems, setComboItems] = useState([{ name: "" }, { name: "" }]);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('offers').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('offers').delete().eq('id', id);
      if (error) throw error;
      fetchOffers();
    } catch (err) {
      console.error("Error deleting offer:", err.message);
    }
  };

  const uploadBanner = async (file) => {
    if (!file) return "";
    const filePath = `${Math.random()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('offers').upload(filePath, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('offers').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    try {
      let final_banner_url = form.banner_url;
      if (form.banner_file) {
        final_banner_url = await uploadBanner(form.banner_file);
      }

      const payload = {
        title: form.title,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        item_ids: form.item_ids ? form.item_ids.split(',') : [],
        start_time: form.start_time,
        end_time: form.end_time,
        banner_url: final_banner_url
      };

      const { error } = await supabase.from('offers').insert([payload]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setForm({ title: "", discount_type: "flat", discount_value: "", item_ids: "", start_time: "", end_time: "", banner_url: "", banner_file: null });
      fetchOffers();
    } catch (err) {
      alert("Error saving offer: " + err.message);
    }
  };

  const handleComboSubmit = async (e) => {
    e.preventDefault();
    try {
      let final_banner_url = "";
      if (comboForm.banner_file) {
        final_banner_url = await uploadBanner(comboForm.banner_file);
      }

      const validItems = comboItems.filter(item => item.name.trim() !== "");

      const payload = {
        title: comboForm.title,
        discount_type: "combo",
        combo_price: Number(comboForm.combo_price),
        combo_items: validItems,
        start_time: comboForm.start_time,
        end_time: comboForm.end_time,
        banner_url: final_banner_url
      };

      const { error } = await supabase.from('offers').insert([payload]);
      if (error) throw error;
      
      setIsComboModalOpen(false);
      setComboForm({ title: "", combo_price: "", start_time: "", end_time: "", banner_file: null });
      setComboItems([{ name: "" }, { name: "" }]);
      fetchOffers();
    } catch (err) {
      alert("Error saving combo: " + err.message);
    }
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 mt-4 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Flash Deals</h1>
        <p className="text-sm text-gray-500">Short windows. Clear offers. More reasons to order.</p>
      </div>

      {/* Action Buttons */}
      <div className="px-4 flex flex-wrap gap-3 mb-6">
        <button onClick={() => setIsModalOpen(true)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 text-sm">
          <Plus size={16} /> New Offer
        </button>
        <button onClick={() => setIsComboModalOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 text-sm">
          <Tag size={16} /> New Combo
        </button>
      </div>

      {error && <p className="text-red-500 px-4 mb-4">{error}</p>}
      
      {/* 🔴 NEW 2-COLUMN GRID LAYOUT 🔴 */}
      {loading ? (
        <p className="px-4 text-gray-500">Loading offers...</p>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-3">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              
              {/* Aspect Square Image */}
              <div className="aspect-square w-full bg-gray-200 relative">
                {offer.banner_url ? (
                  <img src={offer.banner_url} alt={offer.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                
                {offer.discount_type === 'combo' ? (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm">COMBO</div>
                ) : (
                  <div className="absolute top-2 left-2 bg-amber-400 text-black px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm">
                    {offer.discount_type === 'percent' ? `${offer.discount_value}% OFF` : `₹${offer.discount_value} OFF`}
                  </div>
                )}
              </div>

              {/* Offer Details */}
              <div className="p-3 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">{offer.title}</h3>
                
                <div className="mt-auto">
                  {offer.discount_type === 'combo' && offer.combo_items ? (
                    <div className="bg-orange-50/70 rounded-lg p-2 mb-2 border border-orange-100">
                      <div className="space-y-0.5 mb-1">
                        {(typeof offer.combo_items === 'string' ? JSON.parse(offer.combo_items) : offer.combo_items).map((item, idx) => (
                          <div key={idx} className="text-[10px] font-medium text-gray-600 truncate">• {item.name}</div>
                        ))}
                      </div>
                      <div className="text-base font-black text-red-600">₹{offer.combo_price}</div>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <span className="text-base font-black text-gray-900">₹{offer.discount_value}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                    <div>
                      <div className="text-[9px] text-gray-400 mb-0.5">Valid Until</div>
                      <div className="text-red-600 font-bold text-[10px] flex items-center gap-1">
                        <Clock size={10} /> {new Date(offer.end_time).toLocaleDateString()}
                      </div>
                    </div>
                    <button onClick={() => handleDelete(offer.id)} className="p-1.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- STANDARD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Standard Offer</h2>
            <form onSubmit={handleStandardSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1">Title</label><input required type="text" className="w-full border rounded-lg p-2" value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Type</label><select className="w-full border rounded-lg p-2" value={form.discount_type} onChange={e => setForm({...form, discount_type: e.target.value})}><option value="flat">Flat Amount</option><option value="percent">Percentage</option></select></div>
                <div><label className="block text-sm font-medium mb-1">Value (₹ or %)</label><input type="number" className="w-full border rounded-lg p-2" value={form.discount_value} onChange={e => setForm({...form, discount_value: e.target.value})} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Start Time</label><input required type="datetime-local" className="w-full border rounded-lg p-2 text-sm" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">End Time</label><input required type="datetime-local" className="w-full border rounded-lg p-2 text-sm" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Banner Image</label><input type="file" accept="image/*" className="w-full border rounded-lg p-2 text-sm" onChange={e => setForm({...form, banner_file: e.target.files[0]})} /></div>
              <div className="flex gap-3 mt-6 pt-4 border-t"><button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="flex-1 bg-red-600 text-white font-medium rounded-lg">Save Offer</button></div>
            </form>
          </div>
        </div>
      )}

      {/* --- COMBO MODAL --- */}
      {isComboModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-1">Create Combo Offer</h2>
            <form onSubmit={handleComboSubmit} className="space-y-4 mt-4">
              <div><label className="block text-sm font-medium mb-1">Combo Title</label><input required type="text" placeholder="E.g. Solo enjoy pack" className="w-full border rounded-lg p-2" value={comboForm.title} onChange={e => setComboForm({...comboForm, title: e.target.value})} /></div>
              <div className="border rounded-xl p-3 bg-gray-50">
                <label className="block text-sm font-bold mb-2">Combo Items</label>
                {comboItems.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input required type="text" placeholder={`Item ${index + 1}`} className="flex-1 border rounded-lg p-2 text-sm" value={item.name} onChange={(e) => { const newItems = [...comboItems]; newItems[index].name = e.target.value; setComboItems(newItems); }} />
                    {comboItems.length > 2 && <button type="button" onClick={() => setComboItems(comboItems.filter((_, i) => i !== index))} className="px-3 text-red-500 bg-red-50 rounded-lg">X</button>}
                  </div>
                ))}
                <button type="button" onClick={() => setComboItems([...comboItems, { name: "" }])} className="text-sm font-medium text-red-600 mt-1">+ Add another item</button>
              </div>
              <div><label className="block text-sm font-medium mb-1">Total Combo Price (₹)</label><input required type="number" className="w-full border rounded-lg p-2" value={comboForm.combo_price} onChange={e => setComboForm({...comboForm, combo_price: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Start Time</label><input required type="datetime-local" className="w-full border rounded-lg p-2 text-sm" value={comboForm.start_time} onChange={e => setComboForm({...comboForm, start_time: e.target.value})} /></div>
                <div><label className="block text-sm font-medium mb-1">End Time</label><input required type="datetime-local" className="w-full border rounded-lg p-2 text-sm" value={comboForm.end_time} onChange={e => setComboForm({...comboForm, end_time: e.target.value})} /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Banner Image</label><input required type="file" accept="image/*" className="w-full border rounded-lg p-2 text-sm" onChange={e => setComboForm({...comboForm, banner_file: e.target.files[0]})} /></div>
              <div className="flex gap-3 mt-6 pt-4 border-t"><button type="button" onClick={() => setIsComboModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button><button type="submit" className="flex-1 bg-amber-500 text-white font-medium rounded-lg">Save Combo</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
      }
            
