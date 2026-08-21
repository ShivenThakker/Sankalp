/**
 * Sankalp - Core Platform Constants & Enums
 * 
 * Contains all static enum definitions, capability types, disaster types,
 * urgency tiers, volunteer skills, and status badges used across the platform.
 */

/**
 * 12 Core Capability Types for NGOs and Relief Needs
 */
export const CAPABILITY_TYPES = [
  {
    id: 'food',
    label: 'Food Distribution',
    icon: 'Utensils',
    color: '#f59e0b',
    unit: 'kits',
    description: 'Cooked meals, dry rations, and ready-to-eat food packets',
  },
  {
    id: 'water',
    label: 'Clean Water Supply',
    icon: 'Droplets',
    color: '#3b82f6',
    unit: 'litres',
    description: 'Drinking water tankers, bottled water, and purification tablets',
  },
  {
    id: 'medical',
    label: 'Medical & Healthcare',
    icon: 'HeartPulse',
    color: '#ef4444',
    unit: 'kits',
    description: 'Emergency first aid, mobile clinics, essential medicines, doctors',
  },
  {
    id: 'shelter',
    label: 'Emergency Shelter',
    icon: 'Tent',
    color: '#8b5cf6',
    unit: 'tents',
    description: 'Emergency tents, tarpaulin sheets, temporary camp infrastructure',
  },
  {
    id: 'rescue',
    label: 'Search & Rescue',
    icon: 'LifeBuoy',
    color: '#ec4899',
    unit: 'boats',
    description: 'Inflatable rescue boats, evacuation teams, emergency life jackets',
  },
  {
    id: 'transport',
    label: 'Transportation & Logistics',
    icon: 'Truck',
    color: '#06b6d4',
    unit: 'vehicles',
    description: 'Relief supply trucks, 4x4 flood vehicles, emergency transport',
  },
  {
    id: 'childcare',
    label: 'Childcare & Infant Support',
    icon: 'Baby',
    color: '#f43f5e',
    unit: 'kits',
    description: 'Infant milk formula, baby supplies, pediatric care, safe spaces',
  },
  {
    id: 'animal_rescue',
    label: 'Animal & Livestock Care',
    icon: 'PawPrint',
    color: '#10b981',
    unit: 'animals',
    description: 'Livestock evacuation, fodder supply, veterinary first aid',
  },
  {
    id: 'psychological',
    label: 'Psychological Support',
    icon: 'Brain',
    color: '#a855f7',
    unit: 'sessions',
    description: 'Trauma counseling, grief support, psycho-social first aid',
  },
  {
    id: 'financial',
    label: 'Direct Financial Aid',
    icon: 'IndianRupee',
    color: '#22c55e',
    unit: '₹ INR',
    description: 'Emergency cash transfers and direct financial assistance',
  },
  {
    id: 'clothing',
    label: 'Clothing & Blankets',
    icon: 'Shirt',
    color: '#6366f1',
    unit: 'sets',
    description: 'Thermal blankets, dry clothing sets, raincoats, and footwear',
  },
  {
    id: 'sanitation',
    label: 'Sanitation & Hygiene',
    icon: 'Sparkles',
    color: '#14b8a6',
    unit: 'kits',
    description: 'Hygiene kits, sanitary pads, soap, disinfectants, mobile toilets',
  },
];

/**
 * Key-value mapping of Capability Types by ID
 */
export const CAPABILITY_TYPES_MAP = Object.fromEntries(
  CAPABILITY_TYPES.map((c) => [c.id, c])
);

/**
 * Disaster Types recognized by Sankalp and SACHET alerts
 */
export const DISASTER_TYPES = {
  flood: {
    id: 'flood',
    label: 'Flood',
    icon: 'Waves',
    color: '#0284c7',
    description: 'River overflows, flash floods, and intense waterlogging',
  },
  cyclone: {
    id: 'cyclone',
    label: 'Cyclone',
    icon: 'Wind',
    color: '#6366f1',
    description: 'Tropical storms, high-speed winds, and coastal storm surges',
  },
  earthquake: {
    id: 'earthquake',
    label: 'Earthquake',
    icon: 'Activity',
    color: '#d97706',
    description: 'Seismic tremors, structural collapse, and ground rupture',
  },
  landslide: {
    id: 'landslide',
    label: 'Landslide',
    icon: 'Mountain',
    color: '#b45309',
    description: 'Slope failures, mudslides, and hill road disruptions',
  },
  fire: {
    id: 'fire',
    label: 'Fire / Wildfire',
    icon: 'Flame',
    color: '#ef4444',
    description: 'Forest wildfires, urban building fires, and blazes',
  },
  drought: {
    id: 'drought',
    label: 'Drought',
    icon: 'Sun',
    color: '#eab308',
    description: 'Severe water shortages and agricultural distress',
  },
  heatwave: {
    id: 'heatwave',
    label: 'Heatwave',
    icon: 'ThermometerSun',
    color: '#f97316',
    description: 'Hazardously elevated temperatures and heat exhaustion risk',
  },
  tsunami: {
    id: 'tsunami',
    label: 'Tsunami',
    icon: 'Waves',
    color: '#0ea5e9',
    description: 'Coastal sea wave inundation triggered by undersea seismic activity',
  },
  industrial: {
    id: 'industrial',
    label: 'Industrial Hazard',
    icon: 'Factory',
    color: '#64748b',
    description: 'Chemical gas leaks, factory fires, and industrial accidents',
  },
  other: {
    id: 'other',
    label: 'Other Emergency',
    icon: 'AlertTriangle',
    color: '#8b5cf6',
    description: 'General humanitarian emergency or unclassified disaster',
  },
};

/**
 * Array format of Disaster Types
 */
export const DISASTER_TYPES_LIST = Object.values(DISASTER_TYPES);

/**
 * Urgency Levels for Relief Requests & Disaster Needs
 */
export const URGENCY_LEVELS = {
  low: {
    id: 'low',
    label: 'Low',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.3)',
    description: 'Non-immediate support needed within 48-72 hours',
  },
  medium: {
    id: 'medium',
    label: 'Medium',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.3)',
    description: 'Important requirement needed within 24 hours',
  },
  high: {
    id: 'high',
    label: 'High',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    border: 'rgba(249, 115, 22, 0.3)',
    description: 'Severe shortage of essentials, needed within 6-12 hours',
  },
  critical: {
    id: 'critical',
    label: 'Critical',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    border: 'rgba(239, 68, 68, 0.3)',
    description: 'Immediate threat to life or safety, emergency dispatch required',
  },
};

/**
 * Array format of Urgency Levels
 */
export const URGENCY_LEVELS_LIST = Object.values(URGENCY_LEVELS);

/**
 * Verification Status for NGOs and Agencies
 */
export const VERIFICATION_STATUS = {
  pending: {
    id: 'pending',
    label: 'Pending Verification',
    color: '#f59e0b',
    icon: 'Clock',
    bg: 'rgba(245, 158, 11, 0.15)',
    description: 'Documents submitted; undergoing verification check',
  },
  verified: {
    id: 'verified',
    label: 'Verified NGO',
    color: '#10b981',
    icon: 'CheckCircle2',
    bg: 'rgba(16, 185, 129, 0.15)',
    description: 'Fully verified with valid registration, DARPAN ID, and physical address',
  },
  suspended: {
    id: 'suspended',
    label: 'Suspended',
    color: '#ef4444',
    icon: 'AlertCircle',
    bg: 'rgba(239, 68, 68, 0.15)',
    description: 'Temporarily suspended due to compliance review or stale reports',
  },
  rejected: {
    id: 'rejected',
    label: 'Rejected',
    color: '#6b7280',
    icon: 'XCircle',
    bg: 'rgba(107, 114, 128, 0.15)',
    description: 'Verification rejected due to invalid or fraudulent documentation',
  },
};

/**
 * Array format of Verification Statuses
 */
export const VERIFICATION_STATUS_LIST = Object.values(VERIFICATION_STATUS);

/**
 * Operational Status for NGOs
 */
export const OPERATIONAL_STATUS = {
  active: {
    id: 'active',
    label: 'Active',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
    description: 'Actively responding with verified live inventory',
  },
  aging: {
    id: 'aging',
    label: 'Aging Data',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    description: 'No inventory updates recorded in over 48 hours',
  },
  inactive: {
    id: 'inactive',
    label: 'Inactive',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    description: 'Temporarily inactive or not deployed in active zones',
  },
};

/**
 * Array format of Operational Statuses
 */
export const OPERATIONAL_STATUS_LIST = Object.values(OPERATIONAL_STATUS);

/**
 * 12 Volunteer Skill Categories
 */
export const VOLUNTEER_SKILLS = [
  {
    id: 'first_aid',
    label: 'First Aid & CPR',
    icon: 'HeartPulse',
    color: '#ef4444',
    description: 'Certified in basic life support, wound dressing, and emergency triage',
  },
  {
    id: 'driving',
    label: 'Driving & Transportation',
    icon: 'Car',
    color: '#06b6d4',
    description: 'Licensed driver for heavy vehicles, 4x4 trucks, or emergency ambulances',
  },
  {
    id: 'cooking',
    label: 'Community Kitchen / Cooking',
    icon: 'CookingPot',
    color: '#f59e0b',
    description: 'Mass meal preparation, ration packing, and community food distribution',
  },
  {
    id: 'medical',
    label: 'Healthcare & Medical',
    icon: 'Stethoscope',
    color: '#ec4899',
    description: 'Doctor, nurse, pharmacist, or trained medical paramedic',
  },
  {
    id: 'engineering',
    label: 'Civil & Structural Engineering',
    icon: 'Wrench',
    color: '#8b5cf6',
    description: 'Damage assessment, shelter construction, and structural safety evaluation',
  },
  {
    id: 'translation',
    label: 'Language Translation & Interpreting',
    icon: 'Languages',
    color: '#3b82f6',
    description: 'Local language translation and cross-dialect communication assistance',
  },
  {
    id: 'logistics',
    label: 'Warehouse & Supply Logistics',
    icon: 'Boxes',
    color: '#14b8a6',
    description: 'Inventory tracking, dispatch coordination, and warehouse management',
  },
  {
    id: 'counseling',
    label: 'Psychological First Aid & Counseling',
    icon: 'HeartHandshake',
    color: '#a855f7',
    description: 'Trauma support, mental health counseling, and child psychosocial care',
  },
  {
    id: 'drone_operation',
    label: 'Drone Survey & Aerial Mapping',
    icon: 'Radio',
    color: '#6366f1',
    description: 'Aerial reconnaissance, thermal flood mapping, and drop zone verification',
  },
  {
    id: 'swimming',
    label: 'Flood Water Rescue & Swimming',
    icon: 'Waves',
    color: '#0ea5e9',
    description: 'Advanced swimmer, swift-water rescue trained, life guard experience',
  },
  {
    id: 'electrical',
    label: 'Electrical & Power Systems',
    icon: 'Zap',
    color: '#eab308',
    description: 'Emergency generator installation, power line safety, wiring repairs',
  },
  {
    id: 'plumbing',
    label: 'Plumbing & Water Sanitation',
    icon: 'Droplet',
    color: '#10b981',
    description: 'Water filtration setup, pipeline repairs, emergency latrine installation',
  },
];

/**
 * Key-value mapping of Volunteer Skills by ID
 */
export const VOLUNTEER_SKILLS_MAP = Object.fromEntries(
  VOLUNTEER_SKILLS.map((s) => [s.id, s])
);

/**
 * Trust Score Tier Definitions (0 to 100)
 */
export const TRUST_SCORE_TIERS = [
  { min: 90, max: 100, label: 'Highly Verified', color: '#10b981', badge: '🟢' },
  { min: 70, max: 89,  label: 'Verified',        color: '#22c55e', badge: '🟢' },
  { min: 50, max: 69,  label: 'Partially Verified', color: '#f59e0b', badge: '🟡' },
  { min: 30, max: 49,  label: 'Needs Verification', color: '#f97316', badge: '🟡' },
  { min: 0,  max: 29,  label: 'Unverified / At Risk', color: '#ef4444', badge: '🔴' },
];

/**
 * Resource Freshness Status Definitions
 */
export const RESOURCE_FRESHNESS = {
  fresh: { id: 'fresh', label: 'Fresh (<24h)', color: '#10b981' },
  aging: { id: 'aging', label: 'Aging (24-72h)', color: '#f59e0b' },
  stale: { id: 'stale', label: 'Stale (>72h)', color: '#ef4444' },
};

/**
 * Default geographic constants
 */
export const GEO_DEFAULTS = {
  INDIA_CENTER: { lat: 20.5937, lng: 78.9629, zoom: 5 },
  ASSAM_DEFAULT: { lat: 26.1445, lng: 91.7362, zoom: 8 },
  MAX_MATCHING_RADIUS_KM: 100,
};
