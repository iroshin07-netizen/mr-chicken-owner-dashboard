import {useEffect,useState} from "react";
export default function Countdown({end}) {
 const calc=()=>Math.max(0,new Date(end)-Date.now()); const [ms,setMs]=useState(calc());
 useEffect(()=>{const id=setInterval(()=>setMs(calc()),1000);return()=>clearInterval(id)},[end]);
 const total=Math.floor(ms/1000), d=Math.floor(total/86400), h=Math.floor(total%86400/3600), m=Math.floor(total%3600/60), s=total%60;
 return <span className={ms?"countdown":"countdown expired"}>{ms?`${d?d+"d ":""}${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`:"Expired"}</span>
}