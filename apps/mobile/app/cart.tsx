import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cart';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3100';

const BRAND = {
  purple: '#5A31F4',
  pink: '#FF0080',
  orange: '#FF6B35',
  dark: '#0A0A0F',
  surface: '#141420',
  border: 'rgba(255,255,255,0.08)',
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.6)',
};

export default function CartScreen() {
  const router = useRouter();
  const { items, restaurantName, updateQty, clearCart, total, itemCount } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const formatPrice = (n: number) =>
    `€ ${n.toFixed(2).replace('.', ',')}`;

  const handleOrder = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/consumer/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({
            menuItemId: i.id,
            quantity: i.qty,
            unitPrice: i.basePrice,
          })),
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      clearCart();
      Alert.alert('Bestelling geplaatst! 🎉', 'Je eten is onderweg.', [
        { text: 'OK', onPress: () => router.replace('/') },
      ]);
    } catch {
      Alert.alert('Fout', 'Bestelling mislukt. Probeer opnieuw.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={BRAND.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Winkelmandje</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Leegmaken</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ fontSize: 72, marginBottom: 24 }}>🛒</Text>
          <Text style={styles.emptyTitle}>Je mandje is leeg</Text>
          <Text style={styles.emptySubtitle}>Voeg items toe vanuit een restaurant</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => router.replace('/')}>
            <Text style={styles.browseBtnText}>Restaurants bekijken</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* Restaurant Name */}
            <View style={styles.restaurantRow}>
              <Ionicons name="storefront-outline" size={18} color={BRAND.purple} />
              <Text style={styles.restaurantName}>{restaurantName}</Text>
            </View>

            {/* Items */}
            {items.map(item => (
              <View key={item.id} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(parseFloat(item.basePrice) * item.qty)}
                  </Text>
                </View>
                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.qty - 1)}
                  >
                    <Ionicons
                      name={item.qty === 1 ? 'trash-outline' : 'remove'}
                      size={16}
                      color={item.qty === 1 ? '#EF4444' : BRAND.textPrimary}
                    />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.id, item.qty + 1)}
                  >
                    <Ionicons name="add" size={16} color={BRAND.textPrimary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Totals */}
            <View style={styles.totalsCard}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotaal ({itemCount()} items)</Text>
                <Text style={styles.totalValue}>{formatPrice(total())}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Bezorgkosten</Text>
                <Text style={[styles.totalValue, { color: '#22C55E' }]}>Gratis</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.grandTotalLabel}>Totaal</Text>
                <Text style={styles.grandTotalValue}>{formatPrice(total())}</Text>
              </View>
            </View>

            <View style={{ height: 140 }} />
          </ScrollView>

          {/* Order CTA */}
          <View style={styles.ctaWrap}>
            <TouchableOpacity onPress={handleOrder} disabled={submitting} activeOpacity={0.85}>
              <LinearGradient
                colors={[BRAND.purple, BRAND.pink]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaBtn}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.ctaText}>Bestel en betaal</Text>
                    <Text style={styles.ctaPrice}>{formatPrice(total())}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.dark },
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 22, fontWeight: '900', color: BRAND.textPrimary },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, backgroundColor: 'rgba(239,68,68,0.15)' },
  clearBtnText: { color: '#EF4444', fontSize: 13, fontWeight: '700' },

  scroll: { flex: 1 },

  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 16 },
  restaurantName: { fontSize: 16, fontWeight: '800', color: BRAND.textPrimary },

  itemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: BRAND.border },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, fontWeight: '700', color: BRAND.textPrimary, marginBottom: 4 },
  itemPrice: { fontSize: 14, color: BRAND.textSecondary },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: BRAND.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BRAND.border },
  qtyText: { fontSize: 16, fontWeight: '800', color: BRAND.textPrimary, minWidth: 20, textAlign: 'center' },

  totalsCard: { marginHorizontal: 16, marginTop: 24, backgroundColor: BRAND.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: BRAND.border },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  totalLabel: { fontSize: 14, color: BRAND.textSecondary, fontWeight: '600' },
  totalValue: { fontSize: 14, fontWeight: '700', color: BRAND.textPrimary },
  divider: { height: 1, backgroundColor: BRAND.border, marginVertical: 8 },
  grandTotalLabel: { fontSize: 17, fontWeight: '900', color: BRAND.textPrimary },
  grandTotalValue: { fontSize: 17, fontWeight: '900', color: BRAND.textPrimary },

  ctaWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 36, backgroundColor: BRAND.dark },
  ctaBtn: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaText: { color: '#fff', fontSize: 17, fontWeight: '900' },
  ctaPrice: { color: 'rgba(255,255,255,0.8)', fontSize: 17, fontWeight: '800' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 24, fontWeight: '900', color: BRAND.textPrimary, marginBottom: 8 },
  emptySubtitle: { fontSize: 15, color: BRAND.textSecondary, textAlign: 'center', marginBottom: 32 },
  browseBtn: { backgroundColor: BRAND.purple, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30 },
  browseBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
