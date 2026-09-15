import { NavLink } from "react-router-dom";
import { LayoutDashboard, UtensilsCrossed, BadgePercent, Settings, LogOut, Menu } from "lucide-react";
import Logo from "./Logo";
const links=[["/","Dashboard",LayoutDashboard],["/menu","Menu Studio",UtensilsCrossed],["/deals","Flash Deals",BadgePercent],["/settings","Settings",Settings]];
export default function Sidebar({onLogout}) {
 return <><aside className="sidebar"><Logo/><nav className="mt-10 space-y-2">{links.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"} className={({isActive})=>`nav-item ${isActive?"active":""}`}><Icon size={19}/><span>{label}</span></NavLink>)}</nav><div className="mt-auto"><button className="nav-item w-full" onClick={onLogout}><LogOut size={19}/><span>Log out</span></button></div></aside>
 <div className="mobile-nav">{links.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"} className={({isActive})=>isActive?"active":""}><Icon size={19}/><span>{label}</span></NavLink>)}</div></>
}