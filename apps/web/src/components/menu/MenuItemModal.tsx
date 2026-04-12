'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Check } from 'lucide-react';
import { useCartStore } from '../../store/cart';
import type { CartItemModifier } from '../../store/cart';
import { analytics } from '@/lib/analytics';

/* ─── Types (matching Veloci public menu API) ─── */
export interface MenuModifier {
  id: string;
  groupId: string;
  name: string;
  priceAdjustment: string | null;
  isAvailable: boolean;
  sortOrder: number | null;
}

export interface MenuModifierGroup {
  id: string;
  name: string;
  isRequired: boolean;
  minSelections: number | null;
  maxSelections: number | null;
  sortOrder: number | null;
  modifiers: MenuModifier[];
}

export interface MenuItemForModal {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  modifierGroups: MenuModifierGroup[];
  /** Statiegeld (EU beverage deposit) per unit in EUR. */
  depositAmount?: number;
}

interface UpsellItem {
  id: string;
  name: string;
  basePrice: string;
  imageUrl: string | null;
  depositAmount?: number;
}

interface MenuItemModalProps {
  item: MenuItemForModal | null;
  onClose: () => void;
  restaurantSlug: string;
  restaurantName: string;
  upsellItems?: UpsellItem[];
}

const PURPLE = '#5A31F4';
const PINK = '#FF0080';

function fmt(amount: number, currency = 'EUR', locale = 'nl-NL') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

function parsePrice(s: string): number {
  return parseFloat(s) || 0;
}

export function MenuItemModal({ item, onClose, restaurantSlug, restaurantName, currency, locale, upsellItems = [] }: MenuItemModalProps & { currency?: string; locale?: string }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedUpsells, setSelectedUpsells] = useState<Set<string>>(new Set());
  const [radioSelections, setRadioSelections] = useState<Record<string, string>>({});
  const [checkboxSelections, setCheckboxSelections] = useState<Record<string, Set<string>>>({});
  const addItem = useCartStore(s => s.addItem);

  // Reset state when item changes
  useEffect(() => {
    if (!item) return;
    setQuantity(1);

    // Auto-select first option for required single-select groups
    const radios: Record<string, string> = {};
    const checks: Record<string, Set<string>> = {};
    for (const group of item.modifierGroups) {
      const isRadio = group.maxSelections === 1;
      if (isRadio) {
        if (group.isRequired && group.modifiers.length > 0) {
          radios[group.id] = group.modifiers[0].id;
        }
      } else {
        checks[group.id] = new Set();
      }
    }
    setRadioSelections(radios);
    setCheckboxSelections(checks);
    setSelectedUpsells(new Set());
  }, [item?.id]);

  // Calculate total price
  const calcTotal = useCallback(() => {
    if (!item) return 0;
    const base = parsePrice(item.basePrice);
    let modExtra = 0;

    for (const group of item.modifierGroups) {
      const isRadio = group.maxSelections === 1;
      if (isRadio) {
        const selectedId = radioSelections[group.id];
        if (selectedId) {
          const mod = group.modifiers.find(m => m.id === selectedId);
          if (mod) modExtra += parsePrice(mod.priceAdjustment || '0');
        }
      } else {
        const selected = checkboxSelections[group.id];
        if (selected) {
          for (const modId of selected) {
            const mod = group.modifiers.find(m => m.id === modId);
            if (mod) modExtra += parsePrice(mod.priceAdjustment || '0');
          }
        }
      }
    }
    return (base + modExtra) * quantity;
  }, [item, quantity, radioSelections, checkboxSelections]);

  // Check if all required groups have selections
  const allRequiredSelected = useCallback(() => {
    if (!item) return false;
    for (const group of item.modifierGroups) {
      if (!group.isRequired) continue;
      const isRadio = group.maxSelections === 1;
      if (isRadio) {
        if (!radioSelections[group.id]) return false;
      } else {
        const sel = checkboxSelections[group.id];
        if (!sel || sel.size < (group.minSelections || 1)) return false;
      }
    }
    return true;
  }, [item, radioSelections, checkboxSelections]);

  const handleAddToCart = () => {
    if (!item) return;

    const modifiers: CartItemModifier[] = [];
    for (const group of item.modifierGroups) {
      const isRadio = group.maxSelections === 1;
      if (isRadio) {
        const selectedId = radioSelections[group.id];
        if (selectedId) {
          const mod = group.modifiers.find(m => m.id === selectedId);
          if (mod) {
            modifiers.push({
              groupId: group.id,
              groupName: group.name,
              modifierId: mod.id,
              name: mod.name,
              priceAdjustment: parsePrice(mod.priceAdjustment || '0'),
            });
          }
        }
      } else {
        const selected = checkboxSelections[group.id];
        if (selected) {
          for (const modId of selected) {
            const mod = group.modifiers.find(m => m.id === modId);
            if (mod) {
              modifiers.push({
                groupId: group.id,
                groupName: group.name,
                modifierId: mod.id,
                name: mod.name,
                priceAdjustment: parsePrice(mod.priceAdjustment || '0'),
              });
            }
          }
        }
      }
    }

    const basePriceNum = parsePrice(item.basePrice);
    const modifierTotal = modifiers.reduce((sum, m) => sum + m.priceAdjustment, 0);
    const itemUnitPrice = basePriceNum + modifierTotal;

    for (let i = 0; i < quantity; i++) {
      addItem(restaurantSlug, restaurantName, {
        id: item.id,
        name: item.name,
        basePrice: item.basePrice,
        imageUrl: item.imageUrl,
        modifiers,
        depositAmount: item.depositAmount ?? 0,
      }, currency, locale);
    }

    // GA4 + Meta Pixel: standard e-commerce add_to_cart event
    analytics.addToCart({
      item_id: item.id,
      item_name: item.name,
      price: itemUnitPrice,
      quantity,
      affiliation: restaurantName,
    }, currency || 'EUR');

    // Add selected upsell items
    for (const upsell of upsellItems) {
      if (selectedUpsells.has(upsell.id)) {
        addItem(restaurantSlug, restaurantName, {
          id: upsell.id,
          name: upsell.name,
          basePrice: upsell.basePrice,
          imageUrl: upsell.imageUrl,
          depositAmount: upsell.depositAmount ?? 0,
        }, currency, locale);
        analytics.addToCart({
          item_id: upsell.id,
          item_name: upsell.name,
          price: parsePrice(upsell.basePrice),
          quantity: 1,
          affiliation: restaurantName,
        }, currency || 'EUR');
      }
    }
    onClose();
  };

  const handleRadioChange = (groupId: string, modifierId: string) => {
    setRadioSelections(prev => ({ ...prev, [groupId]: modifierId }));
  };

  const handleCheckboxChange = (groupId: string, modifierId: string) => {
    setCheckboxSelections(prev => {
      const set = new Set(prev[groupId] || []);
      if (set.has(modifierId)) set.delete(modifierId);
      else set.add(modifierId);
      return { ...prev, [groupId]: set };
    });
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!item) return null;

  const total = calcTotal();
  const canAdd = allRequiredSelected();

  return (
    <AnimatePresence>
      {item && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9000 }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}
          />

          {/* Panel - slides from right on desktop, from bottom on mobile */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.28 }}
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: 450,
              background: 'var(--bg-elevated)',
              display: 'flex', flexDirection: 'column',
              zIndex: 9001,
              overscrollBehavior: 'contain',
              boxShadow: '-8px 0 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>{item.name}</h2>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-secondary)' }}>{fmt(parsePrice(item.basePrice))}</div>
                </div>
                <button
                  onClick={onClose}
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: 'var(--b8)', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-secondary)', flexShrink: 0,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              {item.description && (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>{item.description}</p>
              )}
            </div>

            {/* Scrollable options area */}
            <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
              {/* Product image */}
              {item.imageUrl && (
                <div style={{ width: '100%', height: 200, overflow: 'hidden' }}>
                  <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* Product info section — always shown */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ fontSize: 14 }}>👁</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Productinformatie</span>
                </div>
                {item.description ? (
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{item.description}</p>
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>Geen beschrijving beschikbaar</p>
                )}
                {/* Ingredient icons based on common keywords */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(() => {
                    const desc = (item.description || '').toLowerCase() + ' ' + item.name.toLowerCase();
                    const tags: Array<{ icon: string; label: string }> = [];
                    if (desc.includes('vegetar')) tags.push({ icon: '🌱', label: 'Vegetarisch' });
                    if (desc.includes('vegan')) tags.push({ icon: '🌿', label: 'Vegan' });
                    if (desc.includes('glutenvrij') || desc.includes('gluten-free')) tags.push({ icon: '🌾', label: 'Glutenvrij' });
                    if (desc.includes('halal')) tags.push({ icon: '☪️', label: 'Halal' });
                    if (desc.includes('spicy') || desc.includes('pittig') || desc.includes('hot')) tags.push({ icon: '🌶️', label: 'Pittig' });
                    if (desc.includes('cheese') || desc.includes('kaas') || desc.includes('mozzarella') || desc.includes('cheddar')) tags.push({ icon: '🧀', label: 'Kaas' });
                    if (desc.includes('chicken') || desc.includes('kip')) tags.push({ icon: '🍗', label: 'Kip' });
                    if (desc.includes('beef') || desc.includes('rund') || desc.includes('kalfs')) tags.push({ icon: '🥩', label: 'Rundvlees' });
                    if (desc.includes('vis') || desc.includes('fish') || desc.includes('tonijn') || desc.includes('zalm')) tags.push({ icon: '🐟', label: 'Vis' });
                    if (desc.includes('garnaal') || desc.includes('shrimp')) tags.push({ icon: '🦐', label: 'Garnalen' });
                    if (tags.length === 0 && !desc.includes('drink') && !desc.includes('cola') && !desc.includes('water')) tags.push({ icon: '🍽️', label: 'Hoofdgerecht' });
                    return tags.map(t => (
                      <span key={t.label} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '3px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                      }}>{t.icon} {t.label}</span>
                    ));
                  })()}
                </div>
              </div>

              {item.modifierGroups.length === 0 ? (
                <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: 13 }}>
                  Voeg direct toe aan je bestelling
                </div>
              ) : (
                item.modifierGroups.map(group => {
                  const isRadio = group.maxSelections === 1;
                  return (
                    <div key={group.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      {/* Group header */}
                      <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 800 }}>{group.name}</span>
                        {group.isRequired && (
                          <span style={{
                            background: `${PURPLE}22`, color: PURPLE,
                            padding: '2px 8px', borderRadius: 20,
                            fontSize: 11, fontWeight: 700,
                          }}>
                            Verplicht
                          </span>
                        )}
                        {!isRadio && group.maxSelections && group.maxSelections > 1 && (
                          <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>
                            Max {group.maxSelections}
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      {group.modifiers.map(mod => {
                        const price = parsePrice(mod.priceAdjustment || '0');
                        const isSelected = isRadio
                          ? radioSelections[group.id] === mod.id
                          : checkboxSelections[group.id]?.has(mod.id) || false;

                        return (
                          <button
                            key={mod.id}
                            onClick={() => isRadio
                              ? handleRadioChange(group.id, mod.id)
                              : handleCheckboxChange(group.id, mod.id)
                            }
                            style={{
                              display: 'flex', alignItems: 'center', gap: 12,
                              width: '100%', padding: '14px 20px', border: 'none',
                              background: isSelected ? `${PURPLE}0a` : 'transparent',
                              cursor: 'pointer', fontFamily: 'inherit',
                              minHeight: 48, /* touch-friendly */
                            }}
                          >
                            {/* Radio / Checkbox indicator */}
                            <div style={{
                              width: 22, height: 22, borderRadius: isRadio ? 11 : 6, flexShrink: 0,
                              border: isSelected ? 'none' : '2px solid var(--border-strong)',
                              background: isSelected ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s',
                            }}>
                              {isSelected && (
                                isRadio
                                  ? <div style={{ width: 8, height: 8, borderRadius: 4, background: 'white' }} />
                                  : <Check size={14} color="white" strokeWidth={3} />
                              )}
                            </div>

                            {/* Name */}
                            <span style={{
                              flex: 1, textAlign: 'left',
                              fontSize: 14, fontWeight: isSelected ? 700 : 500,
                              color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                            }}>
                              {mod.name}
                            </span>

                            {/* Price */}
                            {price > 0 && (
                              <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>
                                + {fmt(price)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}

              {/* Drink / upsell suggestions */}
              {upsellItems.length > 0 && (
                <div style={{ borderBottom: '1px solid var(--border)' }}>
                  <div style={{ padding: '16px 20px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 800 }}>Wil je er iets bij?</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Optioneel</span>
                  </div>
                  {upsellItems.map(upsell => {
                    const isSelected = selectedUpsells.has(upsell.id);
                    const price = parseFloat(upsell.basePrice);
                    return (
                      <button
                        key={upsell.id}
                        onClick={() => {
                          setSelectedUpsells(prev => {
                            const next = new Set(prev);
                            if (next.has(upsell.id)) next.delete(upsell.id);
                            else next.add(upsell.id);
                            return next;
                          });
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12,
                          width: '100%', padding: '12px 20px', border: 'none',
                          background: isSelected ? `${PURPLE}0a` : 'transparent',
                          cursor: 'pointer', fontFamily: 'inherit',
                          minHeight: 48,
                        }}
                      >
                        {upsell.imageUrl && (
                          <img src={upsell.imageUrl} alt={upsell.name} style={{
                            width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
                          }} />
                        )}
                        <div style={{
                          width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                          border: isSelected ? 'none' : '2px solid var(--border-strong)',
                          background: isSelected ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}>
                          {isSelected && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                        <span style={{
                          flex: 1, textAlign: 'left', fontSize: 14,
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}>
                          {upsell.name}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>
                          + {fmt(price, currency, locale)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sticky bottom bar */}
            <div style={{
              padding: '16px 20px', paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
              borderTop: '1px solid var(--border)',
              background: 'var(--bg-elevated)', flexShrink: 0,
            }}>
              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    background: quantity > 1 ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'var(--b10)',
                    border: 'none', cursor: quantity > 1 ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: quantity > 1 ? 'white' : 'var(--text-muted)',
                  }}
                >
                  <Minus size={18} />
                </button>
                <span style={{ fontSize: 18, fontWeight: 900, minWidth: 30, textAlign: 'center' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  style={{
                    width: 40, height: 40, borderRadius: 20,
                    background: `linear-gradient(135deg,${PURPLE},${PINK})`,
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Plus size={18} />
                </button>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                disabled={!canAdd}
                style={{
                  width: '100%', padding: '16px',
                  background: canAdd ? `linear-gradient(135deg,${PURPLE},${PINK})` : 'var(--b10)',
                  border: 'none', borderRadius: 14,
                  color: canAdd ? 'white' : 'var(--text-muted)',
                  fontSize: 16, fontWeight: 900,
                  cursor: canAdd ? 'pointer' : 'not-allowed',
                  boxShadow: canAdd ? '0 8px 20px rgba(90,49,244,0.3)' : 'none',
                  minHeight: 52, /* touch-friendly */
                }}
              >
                Toevoegen · {fmt(total)}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
