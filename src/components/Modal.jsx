export default function Modal({open,onClose,title,children,wide=false}) {
 if(!open) return null;
 return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className={`modal ${wide?"max-w-3xl":"max-w-xl"}`}><div className="flex items-center justify-between mb-5"><h2 className="font-heading text-xl font-bold">{title}</h2><button className="close-btn" onClick={onClose}>×</button></div>{children}</div></div>
}