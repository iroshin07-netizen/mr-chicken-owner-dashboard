import { useMemo, useState } from "react";
import { Plus, Tag, Trash2, Search } from "lucide-react";
import { supabase, supabaseConfigured, OFFER_BUCKET } from "../lib/supabase";
import { sampleMenu } from "../data/sampleData";
import { useRealtimeTable } from "../hooks/useRealtimeTable";
import Modal from "../components/Modal";
import Countdown from "../components/Countdown";
import { money } from "../utils/format";

export default function Deals() {
  const { rows: offers } = useRealtimeTable("offers", []);
  const { rows: menu } = useRealtimeTable("menu_items", sampleMenu);
  const items = menu.length ? menu : sampleMenu;
  const [tab, setTab] = useState("active");
  const [open, setOpen] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    item_ids: [],
    discount_type: "flat",
    discount_value: "",
    start_time: "",
    end_time: "",
    banner_url: "",
  });

  const now = Date.now();
  const active = offers.filter((o) => new Date(o.start_time) <= now && new Date(o.end_time) > now);
  const past = offers.filter((o) => new Date(o.end_time) <= now);
  const list = tab === "active" ? active : past;

  const toggleItem = (id) =>
    setForm((f) => ({
      ...f,
      item_ids: f.item_ids.includes(id) ? f.item_ids.filter((x) => x !== id) : [...f.item_ids, id],
    }));

  const save = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!supabaseConfigured) {
      setSubmitError("Error: Connect Supabase first.");
      return;
    }

    try {
      let banner = form.banner_url;
      const file = e.target.banner.files[0];

      if (file) {
        const path = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const { error: uploadError } = await supabase.storage.from(OFFER_BUCKET).upload(path, file);
        
        if (uploadError) {
          setSubmitError("Storage Error: " + uploadError.message);
          return;
        }
        
        banner = supabase.storage.from(OFFER_BUCKET).getPublicUrl(path).data.publicUrl;
      }

      const payload = {
        ...form,
        item_ids: form.item_ids,
        discount_value: Number(form.discount_value),
        banner_url: banner || null,
      };

      const { error: insertError } = await supabase.from("offers").insert(payload);

      if (insertError) {
        setSubmitError("Database Error: " + insertError.message);
        return;
      }

      // Reset form fields, clear errors, and close modal on successful insert
      setSubmitError("");
      setForm({
        item_ids: [],
        discount_type: "flat",
        discount_value: "",
        start_time: "",
        end_time: "",
        banner_url: "",
      });
      setOpen(false);

    } catch (err) {
      setSubmitError("System Error: " + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-actions">
        <div>
          <h2 className="section-title text-2xl">Flash Deals</h2>
          <p className="muted mt-1">Short windows. Clear offers. More reasons to order.</p>
        </div>
        <button className="btn primary" onClick={() => { setOpen(true); setSubmitError(""); }}>
          <Plus size={18} /> Create New Offer
        </button>
      </div>

      <div className="tabs">
        {["active", "past"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={tab === x ? "selected" : ""}
          >
            {x === "active" ? "Active Offers" : "Past Offers"} <span>{x === "active" ? active.length : past.length}</span>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {list.map((o) => (
          <article className="offer-card" key={o.id}>
            <div className="offer-banner">
              {o.banner_url ? (
                <img src={o.banner_url} alt="Offer banner" />
              ) : (
                <div className="offer-placeholder">
                  <Tag size={34} />
                  <b>FLASH</b>
                </div>
              )}
              <div className="discount-bubble">
                {o.discount_type === "percent" ? `${o.discount_value}% OFF` : `₹${o.discount_value} OFF`}
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-gray-500">
                {(o.item_ids || []).map((id) => items.find((i) => i.id === id)?.name || "Menu item").join(" · ") || "Selected menu items"}
              </p>
              <div className="flex justify-between items-center mt-3">
                <div>
                  <p className="text-xs text-gray-500">{tab === "active" ? "Ends in" : "Ended"}</p>
                  {tab === "active" ? (
                    <Countdown end={o.end_time} />
                  ) : (
                    <p className="font-medium">{new Date(o.end_time).toLocaleDateString("en-IN")}</p>
                  )}
                </div>
                <button
                  className="action-btn danger"
                  onClick={() => supabaseConfigured && supabase.from("offers").delete().eq("id", o.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
        {!list.length && (
          <div className="empty-state col-span-full">
            <Tag size={30} />
            <h3 className="font-heading font-bold mt-3">No {tab} offers yet</h3>
            <p className="muted mt-1">Create your first limited-time deal.</p>
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Create a flash deal" wide>
        <form onSubmit={save} className="space-y-4">
          <label className="field-label">
            Select menu items
            <div className="item-picker">
              {items.map((i) => (
                <button
                  type="button"
                  key={i.id}
                  className={form.item_ids.includes(i.id) ? "picked" : ""}
                  onClick={() => toggleItem(i.id)}
                >
                  <img src={i.image_url} alt={i.name} />
                  <span>{i.name}</span>
                  {form.item_ids.includes(i.id) && <b>✓</b>}
                </button>
              ))}
            </div>
          </label>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="field-label">
              Discount type
              <div className="segmented full">
                {["flat", "percent"].map((x) => (
                  <button
                    type="button"
                    key={x}
                    className={form.discount_type === x ? "selected" : ""}
                    onClick={() => setForm({ ...form, discount_type: x })}
                  >
                    {x === "flat" ? "Flat ₹ off" : "% off"}
                  </button>
                ))}
              </div>
            </label>
            <label className="field-label">
              Discount value
              <input
                className="input"
                required
                type="number"
                min="1"
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
              />
            </label>
            <label className="field-label">
              Start date & time
              <input
                className="input"
                required
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </label>
            <label className="field-label">
              End date & time
              <input
                className="input"
                required
                type="datetime-local"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
            </label>
          </div>
          <label className="field-label">
            Banner image
            <input className="input file-input" name="banner" type="file" accept="image/*" />
          </label>

          {submitError && (
            <div style={{ color: "red", fontSize: "14px", fontWeight: "600", marginTop: "10px" }}>
              {submitError}
            </div>
          )}

          <button className="btn primary w-0.5 w-full" disabled={!form.item_ids.length}>
            Launch flash deal
          </button>
        </form>
      </Modal>
    </div>
  );
                                          }
