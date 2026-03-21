import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

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

const categories = [
  { icon: '🍕', label: 'Pizza' },
  { icon: '🍔', label: 'Burgers' },
  { icon: '🍱', label: 'Sushi' },
  { icon: '🥙', label: 'Kebab' },
  { icon: '🍜', label: 'Asian' },
  { icon: '🥗', label: 'Healthy' },
  { icon: '🍰', label: 'Dessert' },
  { icon: '☕', label: 'Drinks' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [address, setAddress] = useState('');
  const [locationName, setLocationName] = useState('');
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        const [geo] = await Location.reverseGeocodeAsync(loc.coords);
        if (geo) {
          setLocationName(`${geo.street || ''} ${geo.name || ''}`.trim() + (geo.city ? `, ${geo.city}` : ''));
        }
      }
    })();
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ─── Header / Navbar ─── */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <Text style={styles.logoText}>
            En<Text style={{ color: BRAND.purple }}>Joy</Text>
          </Text>
          <TouchableOpacity style={styles.cartBtn}>
            <Ionicons name="bag-outline" size={24} color={BRAND.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Location */}
        <TouchableOpacity style={styles.locationRow}>
          <Ionicons name="location-sharp" size={18} color={BRAND.purple} />
          <Text style={styles.locationText} numberOfLines={1}>
            {locationName || 'Detecting your kingdom…'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={BRAND.textSecondary} />
        </TouchableOpacity>

        {/* Delivery / Pickup Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, deliveryMode === 'delivery' && styles.toggleActive]}
            onPress={() => setDeliveryMode('delivery')}
          >
            <Ionicons name="bicycle" size={16} color={deliveryMode === 'delivery' ? '#fff' : BRAND.textSecondary} />
            <Text style={[styles.toggleText, deliveryMode === 'delivery' && styles.toggleTextActive]}>
              Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, deliveryMode === 'pickup' && styles.toggleActive]}
            onPress={() => setDeliveryMode('pickup')}
          >
            <Ionicons name="storefront-outline" size={16} color={deliveryMode === 'pickup' ? '#fff' : BRAND.textSecondary} />
            <Text style={[styles.toggleText, deliveryMode === 'pickup' && styles.toggleTextActive]}>
              Pickup
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── Hero Banner ─── */}
      <LinearGradient
        colors={[BRAND.purple, BRAND.pink, BRAND.orange]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroBanner}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Elite Flavor,{'\n'}Royally Delivered</Text>
          <Text style={styles.heroSub}>Order from 1000+ restaurants near you</Text>
        </View>
        <View style={styles.heroImagePlaceholder}>
          <Text style={{ fontSize: 64 }}>👑</Text>
        </View>
      </LinearGradient>

      {/* ─── Search Bar ─── */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={BRAND.textSecondary} style={{ marginLeft: 16 }} />
        <TextInput
          placeholder="Search restaurants or dishes…"
          placeholderTextColor={BRAND.textSecondary}
          value={address}
          onChangeText={setAddress}
          style={styles.searchInput}
        />
      </View>

      {/* ─── Categories ─── */}
      <Text style={styles.sectionTitle}>Explore Cuisines</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 16 }}>
        {categories.map((cat, i) => (
          <TouchableOpacity key={i} style={styles.categoryCard}>
            <View style={styles.categoryIconWrap}>
              <Text style={{ fontSize: 28 }}>{cat.icon}</Text>
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── Popular Near You ─── */}
      <Text style={styles.sectionTitle}>Popular Near You</Text>
      <View style={styles.restaurantGrid}>
        {[
          { name: 'Royal Kitchen', cuisine: 'Indian · Curry', rating: 4.8, time: '25-35 min', emoji: '🍛' },
          { name: 'Burger Empire', cuisine: 'Burgers · American', rating: 4.6, time: '15-25 min', emoji: '🍔' },
          { name: 'Sushi Palace', cuisine: 'Japanese · Sushi', rating: 4.9, time: '30-40 min', emoji: '🍣' },
          { name: 'Pizza Throne', cuisine: 'Italian · Pizza', rating: 4.7, time: '20-30 min', emoji: '🍕' },
        ].map((r, i) => (
          <TouchableOpacity key={i} style={styles.restaurantCard}>
            <View style={styles.restaurantImage}>
              <Text style={{ fontSize: 40 }}>{r.emoji}</Text>
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{r.name}</Text>
              <Text style={styles.restaurantCuisine}>{r.cuisine}</Text>
              <View style={styles.restaurantMeta}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{r.rating}</Text>
                </View>
                <Text style={styles.deliveryTime}>{r.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── How It Works ─── */}
      <LinearGradient
        colors={['rgba(90,49,244,0.15)', 'rgba(255,0,128,0.08)']}
        style={styles.howSection}
      >
        <Text style={styles.sectionTitle}>How EnJoy Works</Text>
        {[
          { icon: '📍', title: 'Share Location', sub: 'We find the best near you' },
          { icon: '🍳', title: 'Choose & Order', sub: 'Browse curated menus' },
          { icon: '👑', title: 'Royal Delivery', sub: 'Fresh to your door, fast' },
        ].map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <Text style={styles.stepIcon}>{step.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepSub}>{step.sub}</Text>
            </View>
          </View>
        ))}
      </LinearGradient>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BRAND.dark },
  // Header
  header: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 12 },
  logoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  logoText: { fontSize: 32, fontWeight: '900', color: BRAND.textPrimary },
  cartBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: BRAND.surface, justifyContent: 'center', alignItems: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  locationText: { flex: 1, color: BRAND.textPrimary, fontSize: 15, fontWeight: '600' },
  toggleRow: { flexDirection: 'row', backgroundColor: BRAND.surface, borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, paddingVertical: 10, borderRadius: 10 },
  toggleActive: { backgroundColor: BRAND.purple },
  toggleText: { color: BRAND.textSecondary, fontWeight: '700', fontSize: 14 },
  toggleTextActive: { color: '#fff' },
  // Hero
  heroBanner: { marginHorizontal: 16, borderRadius: 20, padding: 24, flexDirection: 'row', marginBottom: 16, overflow: 'hidden' },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: 26, fontWeight: '900', color: '#fff', lineHeight: 32, marginBottom: 8 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  heroImagePlaceholder: { justifyContent: 'center', alignItems: 'center', width: 80 },
  // Search
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: BRAND.surface, borderRadius: 16, marginHorizontal: 16, marginBottom: 24, borderWidth: 1, borderColor: BRAND.border },
  searchInput: { flex: 1, color: BRAND.textPrimary, fontSize: 16, padding: 16 },
  // Categories
  sectionTitle: { fontSize: 22, fontWeight: '800', color: BRAND.textPrimary, marginHorizontal: 20, marginBottom: 16, marginTop: 8 },
  categoryCard: { alignItems: 'center', marginRight: 16, width: 72 },
  categoryIconWrap: { width: 64, height: 64, borderRadius: 20, backgroundColor: BRAND.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: BRAND.border, marginBottom: 8 },
  categoryLabel: { fontSize: 12, color: BRAND.textSecondary, fontWeight: '600' },
  // Restaurants
  restaurantGrid: { paddingHorizontal: 16, gap: 16, marginBottom: 24 },
  restaurantCard: { flexDirection: 'row', backgroundColor: BRAND.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: BRAND.border },
  restaurantImage: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(90,49,244,0.1)' },
  restaurantInfo: { flex: 1, padding: 14, justifyContent: 'center' },
  restaurantName: { fontSize: 16, fontWeight: '800', color: BRAND.textPrimary, marginBottom: 4 },
  restaurantCuisine: { fontSize: 13, color: BRAND.textSecondary, marginBottom: 8 },
  restaurantMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,215,0,0.1)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  ratingText: { fontSize: 13, color: '#FFD700', fontWeight: '700' },
  deliveryTime: { fontSize: 13, color: BRAND.textSecondary },
  // How it works
  howSection: { marginHorizontal: 16, borderRadius: 20, padding: 24, marginTop: 8 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  stepIcon: { fontSize: 32 },
  stepTitle: { fontSize: 17, fontWeight: '800', color: BRAND.textPrimary, marginBottom: 2 },
  stepSub: { fontSize: 14, color: BRAND.textSecondary },
});
