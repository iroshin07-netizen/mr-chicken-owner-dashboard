export const money = n => `₹${Number(n || 0).toLocaleString("en-IN")}`;
export const shortTime = value => new Date(value).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"});
export const shortDateTime = value => new Date(value).toLocaleString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
export const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");