export const sampleMenu = [
  { id: "sample-1", name: "Zinger Burger", price: 179, category: "Burgers", description: "Crispy chicken fillet, fresh lettuce and signature sauce.", is_available: true, image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80" },
  { id: "sample-2", name: "Peri Peri Fries", price: 119, category: "Fries", description: "Golden fries tossed in smoky peri peri seasoning.", is_available: true, image_url: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=80" },
  { id: "sample-3", name: "Chicken Momos", price: 159, category: "Momos", description: "Juicy chicken momos served with fiery dip.", is_available: true, image_url: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80" },
  { id: "sample-4", name: "Classic Zinger Wrap", price: 149, category: "Wraps", description: "Crunchy chicken, creamy mayo and fresh crunch in a warm wrap.", is_available: true, image_url: "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80" },
  { id: "sample-5", name: "Crispy Chicken Strips", price: 189, category: "Chicken Strips", description: "Tender chicken strips with a crisp golden coating.", is_available: true, image_url: "https://images.unsplash.com/photo-1562967916-eb82221dfb92?auto=format&fit=crop&w=900&q=80" },
  { id: "sample-6", name: "Family Feast Combo", price: 549, category: "Combos", description: "A crowd-pleasing spread of chicken, fries and drinks.", is_available: true, image_url: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?auto=format&fit=crop&w=900&q=80" }
];

export const sampleOrders = [
  { id: "MC-1048", customer_name: "Aarav Sharma", items: [{name:"Zinger Burger", quantity:2}], total_amount: 478, status:"preparing", created_at:new Date(Date.now()-7*60000).toISOString(), cancelled_reason:null },
  { id: "MC-1047", customer_name: "Sara Khan", items: [{name:"Chicken Momos", quantity:1},{name:"Peri Peri Fries",quantity:1}], total_amount:278, status:"picked_up", created_at:new Date(Date.now()-18*60000).toISOString(), cancelled_reason:null },
  { id: "MC-1046", customer_name: "Kabir Verma", items: [{name:"Family Feast Combo", quantity:1}], total_amount:549, status:"delivered", created_at:new Date(Date.now()-42*60000).toISOString(), cancelled_reason:null },
  { id: "MC-1045", customer_name: "Meera Singh", items: [{name:"Classic Zinger Wrap", quantity:2}], total_amount:298, status:"cancelled", created_at:new Date(Date.now()-65*60000).toISOString(), cancelled_reason:"Customer Cancelled" },
  { id: "MC-1044", customer_name: "Rehan Ali", items: [{name:"Crispy Chicken Strips", quantity:1}], total_amount:189, status:"delivered", created_at:new Date(Date.now()-95*60000).toISOString(), cancelled_reason:null }
];

export const sampleTrend = [
  {day:"Fri", revenue:4200},{day:"Sat",revenue:6100},{day:"Sun",revenue:5700},{day:"Mon",revenue:4900},{day:"Tue",revenue:6800},{day:"Wed",revenue:7200},{day:"Today",revenue:8100}
];