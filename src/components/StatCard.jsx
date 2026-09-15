import { useEffect, useRef, useState } from "react";
export default function StatCard({label,value,icon:Icon,tone="red",subtext}) {
  const previous = useRef(value); const [pulse,setPulse] = useState(false);
  useEffect(()=>{ if(previous.current !== value){ setPulse(true); const t=setTimeout(()=>setPulse(false),450); previous.current=value; return ()=>clearTimeout(t); }},[value]);
  return <div className={`card p-5 ${pulse ? "live-pulse":""}`}>
    <div className="flex items-start justify-between"><div><p className="muted">{label}</p><div className="text-3xl font-heading font-bold mt-2">{value}</div>{subtext&&<p className="text-xs text-gray-500 mt-2">{subtext}</p>}</div>
    <div className={`icon-box ${tone}`}><Icon size={21}/></div></div>
  </div>
}