export default function Logo({compact=false}) {
  return <div className="flex items-center gap-3">
    <div className="logo-mark"><span>MC</span></div>
    {!compact && <div><div className="font-heading font-bold text-lg leading-none text-chicken-ink">Mr. Chicken</div><div className="text-[10px] uppercase tracking-[0.22em] text-gray-500 mt-1">Owner Console</div></div>}
  </div>
}