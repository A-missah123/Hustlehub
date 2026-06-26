import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';

const { width, height } = Dimensions.get('window');

// Sheet heights at each snap position
const SHEET_MIN_HEIGHT = height * 0.38;  // Collapsed - basic info + buttons
const SHEET_MID_HEIGHT = height * 0.58;  // Mid - adds location & poster  
const SHEET_MAX_HEIGHT = height * 0.85;  // Expanded - full content with scroll

// Custom map style for modern look
const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#f5f5f5" }]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#bdbdbd" }]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [{ "color": "#ffffff" }]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#757575" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#dadada" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#616161" }]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [{ "color": "#e5e5e5" }]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [{ "color": "#eeeeee" }]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#c9c9c9" }]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#9e9e9e" }]
  }
];

const TaskDetailsScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  const [taskAccepted, setTaskAccepted] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [calculatedDistance, setCalculatedDistance] = useState(null);
  const [canScroll, setCanScroll] = useState(false);
  
  // Sheet animation - starts at 0 (collapsed), goes negative to expand
  const sheetPosition = useRef(new Animated.Value(0)).current;
  const currentPosition = useRef(0);
  const scrollOffset = useRef(0);
  
  // Calculate snap positions (translateY values)
  const SNAP_COLLAPSED = 0;
  const SNAP_MID = -(SHEET_MID_HEIGHT - SHEET_MIN_HEIGHT);
  const SNAP_EXPANDED = -(SHEET_MAX_HEIGHT - SHEET_MIN_HEIGHT);
  
  // Default coordinates (Legon area)
  const defaultOrigin = { latitude: 5.6520, longitude: -0.1870 };
  const defaultDestination = { latitude: 5.6580, longitude: -0.1920 };
  
  // Get task from params and merge with defaults
  const passedTask = route.params?.task || {};
  
  const task = {
    id: '1',
    title: 'Grocery Pickup from Shoprite',
    category: 'Delivery',
    categoryIcon: 'bag-handle',
    categoryColor: '#FF6B6B',
    location: 'Shoprite, Legon Mall',
    address: 'Near the Night Market, Legon',
    destinationName: 'Akuafo Hall',
    destinationAddress: 'Room 205, Block C',
    distance: '0.5 km',
    budget: 25,
    postedBy: 'John K.',
    avatar: 'J',
    rating: 4.8,
    tasksPosted: 15,
    postedAgo: '15 min ago',
    applicants: 3,
    isUrgent: true,
    isDelivery: true,
    description: 'I need someone to pick up my groceries from Shoprite at the mall. The list includes basic items like bread, milk, eggs, fruits, and some vegetables. Please handle with care especially the eggs!',
    requirements: [
      'Must have a bag or container',
      'Delivery within 2 hours',
      'Handle items with care',
    ],
    ...passedTask,
    origin: passedTask.origin || defaultOrigin,
    destination: passedTask.destination || defaultDestination,
  };

  // Snap to a position with animation
  const snapToPosition = useCallback((toValue, velocity = 0) => {
    Animated.spring(sheetPosition, {
      toValue,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
      velocity,
    }).start();
    currentPosition.current = toValue;
    setCanScroll(toValue === SNAP_EXPANDED);
  }, [sheetPosition, SNAP_EXPANDED]);

  // Get closest snap point
  const getClosestSnapPoint = (value) => {
    const points = [SNAP_COLLAPSED, SNAP_MID, SNAP_EXPANDED];
    return points.reduce((prev, curr) => 
      Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
    );
  };

  // Pan responder for the ENTIRE sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // If at expanded and scrolled down, let ScrollView handle it
        if (currentPosition.current === SNAP_EXPANDED && scrollOffset.current > 0 && gestureState.dy > 0) {
          return false;
        }
        // Respond to vertical gestures
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx) && Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        sheetPosition.setOffset(currentPosition.current);
        sheetPosition.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        // Clamp movement between EXPANDED and COLLAPSED
        const newValue = Math.max(SNAP_EXPANDED, Math.min(SNAP_COLLAPSED, gestureState.dy));
        sheetPosition.setValue(newValue);
      },
      onPanResponderRelease: (_, gestureState) => {
        sheetPosition.flattenOffset();
        
        const velocity = gestureState.vy;
        const currentValue = currentPosition.current + gestureState.dy;
        
        let snapTo;
        if (velocity < -0.5) {
          // Fast swipe up
          if (currentValue > SNAP_MID) {
            snapTo = SNAP_MID;
          } else {
            snapTo = SNAP_EXPANDED;
          }
        } else if (velocity > 0.5) {
          // Fast swipe down
          if (currentValue < SNAP_MID) {
            snapTo = SNAP_MID;
          } else {
            snapTo = SNAP_COLLAPSED;
          }
        } else {
          // Snap to closest
          snapTo = getClosestSnapPoint(currentValue);
        }
        
        snapToPosition(snapTo, velocity);
      },
    })
  ).current;

  // Request location permission
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        calculateRoute(location.coords, task.origin);
      }
    })();
  }, []);

  // Calculate route
  const calculateRoute = (from, to) => {
    const points = [];
    const steps = 20;
    for (let i = 0; i <= steps; i++) {
      points.push({
        latitude: from.latitude + (to.latitude - from.latitude) * (i / steps),
        longitude: from.longitude + (to.longitude - from.longitude) * (i / steps),
      });
    }
    setRouteCoordinates(points);
    
    const distance = getDistanceFromLatLonInKm(
      from.latitude, from.longitude,
      to.latitude, to.longitude
    );
    setCalculatedDistance(distance.toFixed(1));
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  // Fit map to markers
  useEffect(() => {
    if (mapRef.current && userLocation) {
      const coordinates = [
        userLocation,
        task.origin,
        ...(task.isDelivery ? [task.destination] : []),
      ];
      
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(coordinates, {
          edgePadding: { top: 100, right: 50, bottom: SHEET_MIN_HEIGHT + 50, left: 50 },
          animated: true,
        });
      }, 500);
    }
  }, [userLocation]);

  const handleAcceptTask = () => {
    setTaskAccepted(true);
  };

  const handleNegotiate = () => {
    navigation.navigate('Messages', { taskId: task.id, negotiate: true });
  };

  const handleMessage = () => {
    navigation.navigate('Messages');
  };

  const centerOnUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        ...userLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
  };

  // Track scroll position to know when to allow sheet drag
  const handleScroll = (event) => {
    scrollOffset.current = event.nativeEvent.contentOffset.y;
  };

  // Custom marker component
  const CustomMarker = ({ type, label }) => (
    <View style={styles.customMarker}>
      <View style={[
        styles.markerContainer,
        type === 'user' && styles.markerUser,
        type === 'origin' && styles.markerOrigin,
        type === 'destination' && styles.markerDestination,
      ]}>
        <Ionicons 
          name={type === 'user' ? 'person' : type === 'origin' ? 'location' : 'flag'} 
          size={18} 
          color="#FFFFFF" 
        />
      </View>
      {label && (
        <View style={styles.markerLabel}>
          <Text style={styles.markerLabelText}>{label}</Text>
        </View>
      )}
    </View>
  );

  // Calculate interpolated values for map controls
  const mapControlsBottom = sheetPosition.interpolate({
    inputRange: [SNAP_EXPANDED, SNAP_COLLAPSED],
    outputRange: [SHEET_MAX_HEIGHT + 20, SHEET_MIN_HEIGHT + 20],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Map - Full screen behind sheet */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: task.origin.latitude,
            longitude: task.origin.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
          showsCompass={false}
        >
          {userLocation && (
            <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 1 }}>
              <CustomMarker type="user" label="You" />
            </Marker>
          )}
          
          <Marker coordinate={task.origin} anchor={{ x: 0.5, y: 1 }}>
            <CustomMarker type="origin" label={task.isDelivery ? "Pickup" : "Task"} />
          </Marker>
          
          {task.isDelivery && task.destination && (
            <Marker coordinate={task.destination} anchor={{ x: 0.5, y: 1 }}>
              <CustomMarker type="destination" label="Dropoff" />
            </Marker>
          )}
          
          {userLocation && routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeColor={colors.primary}
              strokeWidth={4}
              lineDashPattern={[1]}
            />
          )}
          
          {task.isDelivery && task.destination && (
            <Polyline
              coordinates={[task.origin, task.destination]}
              strokeColor="#4CAF50"
              strokeWidth={4}
              lineDashPattern={[10, 5]}
            />
          )}
        </MapView>
        
        {/* Header overlay */}
        <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="bookmark-outline" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Distance badge */}
        {calculatedDistance && (
          <Animated.View style={[styles.distanceBadge, { bottom: mapControlsBottom }]}>
            <Ionicons name="navigate" size={16} color={colors.primary} />
            <Text style={styles.distanceBadgeText}>{calculatedDistance} km away</Text>
          </Animated.View>
        )}
        
        {/* Center on user button */}
        {userLocation && (
          <Animated.View style={[styles.centerButton, { bottom: mapControlsBottom }]}>
            <TouchableOpacity onPress={centerOnUser} style={styles.centerButtonInner}>
              <Ionicons name="locate" size={22} color={colors.primary} />
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Bottom Sheet - ENTIRE sheet is draggable */}
      <Animated.View 
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: sheetPosition }] }
        ]}
        {...panResponder.panHandlers}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandleContainer}>
          <View style={styles.dragHandle} />
        </View>

        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          bounces={false}
          scrollEnabled={canScroll}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.sheetScrollContent}
        >
          {/* Category & Urgent Badge */}
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: `${task.categoryColor}15` }]}>
              <Ionicons name={task.categoryIcon} size={16} color={task.categoryColor} />
              <Text style={[styles.categoryText, { color: task.categoryColor }]}>{task.category}</Text>
            </View>
            {task.isUrgent && (
              <View style={styles.urgentBadge}>
                <Ionicons name="flash" size={14} color="#FF6B6B" />
                <Text style={styles.urgentText}>Urgent</Text>
              </View>
            )}
          </View>

          {/* Title */}
          <Text style={styles.taskTitle}>{task.title}</Text>

          {/* Quick Info Row - Always visible */}
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="cash" size={18} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>GH₵ {task.budget}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="time" size={18} color="#FF9800" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Posted</Text>
                <Text style={styles.infoValue}>{task.postedAgo}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={[styles.infoIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="navigate" size={18} color="#2196F3" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Distance</Text>
                <Text style={styles.infoValue}>{calculatedDistance || task.distance} km</Text>
              </View>
            </View>
          </View>

          {/* Location Cards */}
          <View style={styles.locationCards}>
            <View style={styles.locationCard}>
              <View style={[styles.locationDot, { backgroundColor: colors.primary }]} />
              <View style={styles.locationCardContent}>
                <Text style={styles.locationCardLabel}>{task.isDelivery ? 'Pickup' : 'Location'}</Text>
                <Text style={styles.locationCardName}>{task.location}</Text>
                <Text style={styles.locationCardAddress}>{task.address}</Text>
              </View>
            </View>
            
            {task.isDelivery && (
              <>
                <View style={styles.locationLine} />
                <View style={styles.locationCard}>
                  <View style={[styles.locationDot, { backgroundColor: '#4CAF50' }]} />
                  <View style={styles.locationCardContent}>
                    <Text style={styles.locationCardLabel}>Dropoff</Text>
                    <Text style={styles.locationCardName}>{task.destinationName}</Text>
                    <Text style={styles.locationCardAddress}>{task.destinationAddress}</Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Poster Info */}
          <TouchableOpacity style={styles.posterCard}>
            <View style={styles.posterAvatar}>
              <Text style={styles.posterAvatarText}>{task.avatar}</Text>
            </View>
            <View style={styles.posterInfo}>
              <Text style={styles.posterName}>{task.postedBy}</Text>
              <View style={styles.posterMeta}>
                <Ionicons name="star" size={14} color="#FFB800" />
                <Text style={styles.posterRating}>{task.rating}</Text>
                <Text style={styles.posterTasks}> · {task.tasksPosted} tasks posted</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
              <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>

          {/* Requirements */}
          {task.requirements && task.requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requirements</Text>
              {task.requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Bottom spacer for action buttons */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Action - Accept/Negotiate - Always visible */}
        <View style={[styles.bottomAction, { paddingBottom: insets.bottom + spacing.md }]}>
          {taskAccepted ? (
            <View style={styles.acceptedContainer}>
              <View style={styles.acceptedBadge}>
                <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                <Text style={styles.acceptedText}>Task Accepted!</Text>
              </View>
              <Text style={styles.acceptedSubtext}>
                Contact {task.postedBy} to coordinate
              </Text>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.negotiateButton}
                onPress={handleNegotiate}
                activeOpacity={0.8}
              >
                <Ionicons name="chatbubbles-outline" size={20} color={colors.primary} />
                <Text style={styles.negotiateButtonText}>Negotiate</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.acceptButton}
                onPress={handleAcceptTask}
                activeOpacity={0.8}
              >
                <Text style={styles.acceptButtonText}>Accept Task</Text>
                <View style={styles.budgetChip}>
                  <Text style={styles.budgetChipText}>GH₵ {task.budget}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EFFA',
  },
  mapContainer: {
    flex: 1,
  },
  // Header
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Map controls
  distanceBadge: {
    position: 'absolute',
    left: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 5,
  },
  distanceBadgeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: spacing.xs,
  },
  centerButton: {
    position: 'absolute',
    right: spacing.lg,
    zIndex: 5,
  },
  centerButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  // Custom Markers
  customMarker: {
    alignItems: 'center',
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  markerUser: {
    backgroundColor: '#2196F3',
  },
  markerOrigin: {
    backgroundColor: colors.primary,
  },
  markerDestination: {
    backgroundColor: '#4CAF50',
  },
  markerLabel: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  markerLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  // Bottom Sheet
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -(SHEET_MAX_HEIGHT - SHEET_MIN_HEIGHT),
    height: SHEET_MAX_HEIGHT,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 24,
  },
  dragHandleContainer: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  sheetScrollContent: {
    paddingHorizontal: spacing.lg,
  },
  // Badges
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF0F0',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  urgentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FF6B6B',
  },
  taskTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: spacing.md,
    lineHeight: 28,
  },
  // Info row
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  // Location cards
  locationCards: {
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
    marginRight: spacing.md,
  },
  locationCardContent: {
    flex: 1,
  },
  locationCardLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  locationCardName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  locationCardAddress: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: colors.border,
    marginLeft: 5,
    marginVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  // Poster card
  posterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  posterAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  posterAvatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  posterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterRating: {
    fontSize: typography.fontSize.sm,
    fontWeight: '500',
    color: colors.textSecondary,
    marginLeft: 4,
  },
  posterTasks: {
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Sections
  section: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  requirementText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  // Bottom action
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  negotiateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${colors.primary}12`,
    borderRadius: 14,
    paddingVertical: 16,
    gap: spacing.xs,
  },
  negotiateButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.primary,
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    gap: spacing.sm,
  },
  acceptButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  budgetChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 8,
  },
  budgetChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  acceptedContainer: {
    alignItems: 'center',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 14,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  acceptedText: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.success,
  },
  acceptedSubtext: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default TaskDetailsScreen;
