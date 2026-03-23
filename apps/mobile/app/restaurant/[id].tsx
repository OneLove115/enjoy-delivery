import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCartStore } from '../../store/cart';

const { width } = Dimensions.get('window');

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

type MenuItem = {
  id: string;
  name: string;
  description: string | null;
  basePrice: string;
  imageUrl: string | null;
  isAvailable: boolean;
};

type MenuCategory = {
  id: string;
  name: string;
  items: MenuItem[];
};

export default function RestaurantMenuScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const { addItem, itemCount } = useCartStore();

  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');
  const [addedId, setAddedId] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const restaurantName = name ? decodeURIComponent(name) : 'Restaurant';

  useEffect(() => {
    if (!id) return;
    fetch(`${API_BASE}/api/restaurants/${id}/menu`)
      .then(r => r.json())
      .then(data => {
        const categories: MenuCategory[] = data?.data?.menu || [];
        setMenu(categories);
        if (categories.length > 0) setActiveTab(categories[0].id);
      })
      .catch(() => setMenu([]))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = (item: MenuItem) => {
    if (!item.isAvailable) return;
    addItem(id!, restaurantName, {
      id: item.id,
      name: item.name,
      basePrice: item.basePrice,
      imageUrl: item.imageUrl,
    });
    setAddedId(item.id);
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start(() => setAddedId(null));
  };

  const formatPrice = (price: string) =>
    `€ ${parseFloat(price).toFixed(2).replace('.', ',')}`;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={BRAND.purple} />
        <Text style={styles.loadingText}>Menu laden…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={BRAND.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{restaurantName}</Text>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => router.push('/cart')}
        >
          <Ionicons name="bag-outline" size={22} color={BRAND.textPrimary} />
          {itemCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Category Tabs */}
      {menu.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {menu.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.tab, activeTab === cat.id && styles.tabActive]}
              onPress={() => setActiveTab(cat.id)}
            >
              <Text style={[styles.tabText, activeTab === cat.id && styles.tabTextActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Menu Items */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {menu.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48, marginBottom: 16 }}>🍽️</Text>
            <Text style={styles.emptyText}>Geen menu beschikbaar</Text>
          </View>
        ) : (
          menu
            .filter(cat => cat.items.length > 0)
            .map(cat => (
              <View key={cat.id} style={styles.categorySection}>
                <Text style={styles.categoryTitle}>{cat.name}</Text>
                {cat.items.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.menuItem, !item.isAvailable && styles.menuItemDisabled]}
                    onPress={() => handleAdd(item)}
                    disabled={!item.isAvailable}
                    activeOpacity={0.75}
                  >
                    <View style={styles.menuItemInfo}>
                      <Text style={styles.menuItemName}>{item.name}</Text>
                      {item.description && (
                        <Text style={styles.menuItemDesc} numberOfLines={2}>{item.description}</Text>
                      )}
                      <Text style={styles.menuItemPrice}>{formatPrice(item.basePrice)}</Text>
                    </View>
                    <View style={styles.menuItemRight}>
                      {item.imageUrl ? (
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.menuItemImage}
                        />
                      ) : (
                        <View style={styles.menuItemImagePlaceholder}>
                          <Text style={{ fontSize: 32 }}>🍽️</Text>
                        </View>
                      )}
                      <Animated.View
                        style={[
                          styles.addBtn,
                          addedId === item.id && styles.addBtnActive,
                          { transform: [{ scale: addedId === item.id ? scaleAnim : 1 }] },
                        ]}
                      >
                        <Ionicons
                          name={addedId === item.id ? 'checkmark' : 'add'}
                          size={18}
                          color="#fff"
                        />
                      </Animated.View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky Cart Bar */}
      {itemCount() > 0 && (
        <View style={styles.cartBar}>
          <TouchableOpacity
            style={styles.cartBarBtn}
            onPress={() => router.push('/cart')}
          >
            <LinearGradient
              colors={[BRAND.purple, BRAND.pink]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.cartBarGradient}
            >
              <View style={styles.cartBarBadge}>
                <Text style={styles.cartBarBadgeText}>{itemCount()}</Text>
              </View>
              <Text style={styles.cartBarLabel}>Bekijk winkelmandje</Text>
              <Text style={styles.cartBarPrice}>
                € {useCartStore.getState().total().toFixed(2).replace('.', ',')}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.dark },
  loadingContainer: { flex: 1, backgroundColor: BRAND.dark, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { color: BRAND.textSecondary, fontSize: 15, fontWeight: '600' },

  // Header
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND.surface, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', color: BRAND.textPrimary },
  cartBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: BRAND.surface, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: BRAND.purple, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  // Tabs
  tabsScroll: { maxHeight: 52, borderBottomWidth: 1, borderBottomColor: BRAND.border },
  tabsContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  tab: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: BRAND.surface },
  tabActive: { backgroundColor: BRAND.purple },
  tabText: { color: BRAND.textSecondary, fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#fff' },

  // Scroll
  scroll: { flex: 1 },

  // Category
  categorySection: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 8 },
  categoryTitle: { fontSize: 20, fontWeight: '900', color: BRAND.textPrimary, marginBottom: 16 },

  // Menu Item
  menuItem: { flexDirection: 'row', backgroundColor: BRAND.surface, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: BRAND.border, overflow: 'hidden', padding: 14 },
  menuItemDisabled: { opacity: 0.4 },
  menuItemInfo: { flex: 1, paddingRight: 12 },
  menuItemName: { fontSize: 15, fontWeight: '800', color: BRAND.textPrimary, marginBottom: 4 },
  menuItemDesc: { fontSize: 13, color: BRAND.textSecondary, lineHeight: 18, marginBottom: 8 },
  menuItemPrice: { fontSize: 15, fontWeight: '800', color: BRAND.textPrimary },
  menuItemRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  menuItemImage: { width: 80, height: 80, borderRadius: 12 },
  menuItemImagePlaceholder: { width: 80, height: 80, borderRadius: 12, backgroundColor: 'rgba(90,49,244,0.15)', justifyContent: 'center', alignItems: 'center' },
  addBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: BRAND.purple, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
  addBtnActive: { backgroundColor: '#22C55E' },

  // Empty state
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyText: { color: BRAND.textSecondary, fontSize: 16, fontWeight: '700' },

  // Cart bar
  cartBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 36 },
  cartBarBtn: { borderRadius: 20, overflow: 'hidden' },
  cartBarGradient: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  cartBarBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  cartBarBadgeText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  cartBarLabel: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '800' },
  cartBarPrice: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
