import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function MenuStudio() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error("Error fetching menu:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter(item => 
    item.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-4 mt-4 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Menu Studio</h1>
        <p className="text-sm text-gray-500">Make your customer menu match the kitchen.</p>
      </div>

      {/* Top Bar (Search & Add) */}
      <div className="px-4 flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search menu..." 
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm flex items-center gap-2 text-sm whitespace-nowrap">
          <Plus size={18} /> Add New Item
        </button>
      </div>

      {/* 🔴 NEW 2-COLUMN GRID LAYOUT FOR MENU 🔴 */}
      {loading ? (
        <p className="px-4 text-gray-500">Loading menu...</p>
      ) : (
        <div className="px-4 grid grid-cols-2 gap-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col">
              
              {/* Image (Square) */}
              <div className="aspect-square w-full bg-gray-100 relative">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                )}
                
                {/* Stock Badge */}
                {item.in_stock !== false && (
                  <span className="absolute top-2 right-2 bg-white text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-green-100">
                    In stock
                  </span>
                )}
              </div>

              {/* Item Details */}
              <div className="p-3 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <div className="flex-1">
                    <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wide">{item.category || "General"}</p>
                    <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{item.name}</h3>
                  </div>
                  <span className="font-black text-gray-900 text-sm">₹{item.price}</span>
                </div>
                
                <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">{item.description}</p>
                
                {/* Bottom Actions */}
                <div className="mt-auto flex justify-between items-center pt-2 border-t border-gray-50">
                  {/* Custom Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={item.in_stock !== false} />
                    <div className="w-8 h-4.5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-green-500"></div>
                  </label>

                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
