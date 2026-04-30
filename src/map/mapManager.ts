import L from 'leaflet';
import type { LatLng } from '../types';

// ═══════════════════════════════════════════════════════════════════
// WATERWAY SEGMENTS — Real coordinates from OpenStreetMap
// Each segment: junction A → junction B, following the actual river
// ═══════════════════════════════════════════════════════════════════

// Río Tigre: Estación Fluvial → Río Luján junction
// OSM Way 179483801, sampled northward from station
const RIO_TIGRE: LatLng[] = [
  [-34.4212, -58.5801], // Estación Fluvial (OSM node)
  [-34.4215, -58.5807],
  [-34.4206, -58.5798],
  [-34.4202, -58.5795],
  [-34.4198, -58.5793],
  [-34.4192, -58.5791],
  [-34.4188, -58.5791],
  [-34.4174, -58.5793],
  [-34.4166, -58.5793],
  [-34.4161, -58.5793],
  [-34.4151, -58.5791], // Junction with Río Luján
];

// Río Luján westward: Tigre junction → Carapachay junction
// OSM Ways 955841368 + 180594777 (reversed, heading upstream)
const LUJAN_W: LatLng[] = [
  [-34.4151, -58.5791], // Tigre junction
  [-34.4148, -58.5802],
  [-34.4135, -58.5837],
  [-34.4127, -58.5854],
  [-34.412, -58.5863],
  [-34.4114, -58.587],
  [-34.4081, -58.5907],
  [-34.4063, -58.5926],
  [-34.4053, -58.5936],
  [-34.4047, -58.5942], // Carapachay junction
];

// Río Luján continued: Carapachay junction → Caraguatá junction
// OSM Way 180523221 (reversed)
const LUJAN_W2: LatLng[] = [
  [-34.4047, -58.5942], // Carapachay junction
  [-34.4039, -58.5955],
  [-34.403, -58.5972],
  [-34.4021, -58.6001],
  [-34.4014, -58.6015],
  [-34.3993, -58.6045],
  [-34.3972, -58.6071],
  [-34.3957, -58.6091],
  [-34.3945, -58.6109],
  [-34.3904, -58.6185],
  [-34.3897, -58.6207],
  [-34.3892, -58.622],
  [-34.3877, -58.626],
  [-34.3864, -58.6289],
  [-34.3855, -58.6309],
  [-34.385, -58.6317],
  [-34.3844, -58.6324], // Caraguatá junction
];

// Río Luján continued: Caraguatá junction → Canal Arias junction
// OSM Ways 180523221 + 180523220 + 180631029 + 1306603190 + 180706119 + 180697086
const LUJAN_W3: LatLng[] = [
  [-34.3844, -58.6324], // Caraguatá junction
  [-34.3835, -58.6336],
  [-34.3824, -58.6359],
  [-34.3817, -58.6378],
  [-34.3814, -58.6397],
  [-34.3798, -58.6432],
  [-34.3785, -58.6452],
  [-34.378, -58.6461],
  [-34.3771, -58.6492],
  [-34.3763, -58.651],
  [-34.3754, -58.6526],
  [-34.3748, -58.6534],
  [-34.3739, -58.6544],
  [-34.3725, -58.6564],
  [-34.3721, -58.6567],
  [-34.3701, -58.6582],
  [-34.3685, -58.6592],
  [-34.3669, -58.66],
  [-34.3662, -58.6622],
  [-34.3656, -58.6643],
  [-34.3642, -58.6659],
  [-34.362, -58.6677],
  [-34.3608, -58.6702],
  [-34.3599, -58.673],
  [-34.3598, -58.6745],
  [-34.3596, -58.6761],
  [-34.3588, -58.6778],
  [-34.3577, -58.6791],
  [-34.3557, -58.6813],
  [-34.3532, -58.6844],
  [-34.352, -58.6857],
  [-34.3514, -58.6861], // Canal Arias junction
];

// Río Luján eastward: Tigre junction → Sarmiento junction
// OSM Way 955841368
const LUJAN_E: LatLng[] = [
  [-34.4151, -58.5791], // Tigre junction
  [-34.4163, -58.5721],
  [-34.417, -58.5684],
  [-34.4172, -58.5676], // Sarmiento junction
];

// Río Carapachay: Luján junction → Río Paraná de las Palmas
// OSM Way 30164212 (reversed, boats go S→N), sampled every ~15th node
const CARAPACHAY: LatLng[] = [
  [-34.4047, -58.5942], // Luján junction (S end)
  [-34.3986, -58.5942],
  [-34.3956, -58.5918],
  [-34.3937, -58.5907],
  [-34.391, -58.5925],
  [-34.3882, -58.5952],
  [-34.3859, -58.596],
  [-34.3852, -58.5986],
  [-34.3849, -58.6002],
  [-34.3842, -58.6016],
  [-34.383, -58.6033],
  [-34.3829, -58.6055],
  [-34.3832, -58.6073],
  [-34.3854, -58.6114],
  [-34.3855, -58.6128],
  [-34.3842, -58.6142],
  [-34.383, -58.6164],
  [-34.3818, -58.6198],
  [-34.3806, -58.6205],
  [-34.3786, -58.6204],
  [-34.3772, -58.6207],
  [-34.3748, -58.6255],
  [-34.3729, -58.6283],
  [-34.3698, -58.6287],
  [-34.3659, -58.6287],
  [-34.3636, -58.6291],
  [-34.36, -58.6298],
  [-34.3586, -58.6288],
  [-34.3563, -58.6296],
  [-34.3561, -58.6316],
  [-34.3558, -58.6339],
  [-34.3546, -58.6364],
  [-34.3513, -58.6365],
  [-34.3487, -58.6368],
  [-34.3466, -58.6373],
  [-34.3442, -58.6394],
  [-34.3427, -58.6391],
  [-34.3401, -58.6381],
  [-34.3386, -58.6383],
  [-34.3377, -58.6396],
  [-34.3356, -58.6439],
  [-34.3339, -58.6465],
  [-34.3322, -58.6468],
  [-34.3298, -58.6456],
  [-34.3265, -58.6442],
  [-34.3237, -58.6419],
  [-34.3209, -58.641],
  [-34.3182, -58.6409],
  [-34.3161, -58.6376],
  [-34.3146, -58.6372],
  [-34.3125, -58.6377],
  [-34.3098, -58.637],
  [-34.3072, -58.6357],
  [-34.3049, -58.6344],
  [-34.302, -58.6338],
  [-34.2993, -58.6341],
  [-34.2962, -58.634],
  [-34.2935, -58.633],
  [-34.2902, -58.6329],
  [-34.2867, -58.6323],
  [-34.2838, -58.6333],
  [-34.2809, -58.6344],
  [-34.2807, -58.6356],
  [-34.2803, -58.6362],
  [-34.2774, -58.6373],
  [-34.2755, -58.638],
  [-34.2735, -58.6394],
  [-34.2719, -58.6399],
  [-34.2704, -58.6393],
  [-34.2682, -58.6383], // Paraná de las Palmas junction (N end)
];

// Río Sarmiento: Luján junction → Capitán junction (S → N)
// OSM Way 30163438 reversed, sampled every ~7th node
const SARMIENTO: LatLng[] = [
  [-34.4172, -58.5676], // Luján junction (S)
  [-34.4153, -58.5686],
  [-34.4126, -58.57],
  [-34.4092, -58.5709],
  [-34.4065, -58.572],
  [-34.4029, -58.5738],
  [-34.3987, -58.5731],
  [-34.3962, -58.5726],
  [-34.394, -58.5728],
  [-34.3918, -58.574],
  [-34.3895, -58.5755],
  [-34.388, -58.5776],
  [-34.3868, -58.5781],
  [-34.385, -58.5773],
  [-34.3834, -58.5766],
  [-34.3818, -58.5753],
  [-34.3813, -58.5743],
  [-34.3815, -58.5721],
  [-34.3823, -58.5696],
  [-34.3842, -58.5688],
  [-34.3854, -58.567],
  [-34.386, -58.5643],
  [-34.3862, -58.563],
  [-34.3861, -58.5607],
  [-34.3845, -58.5607],
  [-34.3831, -58.5601],
  [-34.3814, -58.56],
  [-34.3804, -58.5599],
  [-34.3791, -58.5594],
  [-34.3784, -58.5585],
  [-34.3764, -58.5585],
  [-34.3754, -58.5583], // Capitán junction (N)
];

// Río Capitán: Sarmiento junction → Río Paraná de las Palmas
// OSM Way 30090975 (reversed, boats go S→N), sampled every ~8th node
const CAPITAN: LatLng[] = [
  [-34.3754, -58.5583], // Sarmiento junction (S)
  [-34.3716, -58.5594],
  [-34.3688, -58.5603],
  [-34.3667, -58.5611],
  [-34.3617, -58.5633],
  [-34.3566, -58.5657],
  [-34.3541, -58.5665],
  [-34.3507, -58.5652],
  [-34.3475, -58.5623],
  [-34.345, -58.5623],
  [-34.3421, -58.5609],
  [-34.3404, -58.5596],
  [-34.3384, -58.5588],
  [-34.3359, -58.5586],
  [-34.3346, -58.559],
  [-34.3336, -58.56],
  [-34.3333, -58.5614],
  [-34.3334, -58.5624],
  [-34.3345, -58.5655],
  [-34.3341, -58.5662],
  [-34.3333, -58.5668],
  [-34.3312, -58.5678],
  [-34.3282, -58.5697],
  [-34.3253, -58.571],
  [-34.3223, -58.5707],
  [-34.3175, -58.5706],
  [-34.315, -58.5699],
  [-34.3109, -58.5684],
  [-34.3077, -58.5689],
  [-34.3043, -58.5706],
  [-34.301, -58.5709],
  [-34.2978, -58.572],
  [-34.2958, -58.5734],
  [-34.2947, -58.5724],
  [-34.2933, -58.5705],
  [-34.29, -58.5665], // Paraná de las Palmas junction (N)
];

// Río Paraná de las Palmas — NW from Carapachay junction toward Puerto Campana
// OSM Ways 1028588353 + 183600706 + 183513141 + 262795444
// Dense points added between Boca Carabelas and Arroyo Fermín for 455 routes
const PARANA_NW: LatLng[] = [
  [-34.2682, -58.6383], // [0] Carapachay junction
  [-34.2648, -58.6491], // [1] Canal Arias / Canal Serna junction
  [-34.2618, -58.6628], // [2]
  [-34.2592, -58.6725], // [3]
  [-34.2581, -58.675], // [4]
  [-34.2553, -58.6855], // [5]
  [-34.2523, -58.6965], // [6]
  [-34.2509, -58.7018], // [7]
  [-34.2495, -58.7071], // [8]
  [-34.2484, -58.7121], // [9] Boca Carabelas (Río Carabelas mouth)
  [-34.2481, -58.7124], // [10]
  [-34.2479, -58.7145], // [11]
  [-34.2463, -58.7228], // [12]
  [-34.2454, -58.7287], // [13] ← near dock
  [-34.2447, -58.7338], // [14] ← near dock
  [-34.2428, -58.744], // [15]
  [-34.2411, -58.752], // [16]
  [-34.239, -58.762], // [17]
  [-34.2361, -58.7754], // [18]
  [-34.2358, -58.7772], // [19]
  [-34.233, -58.786], // [20]
  [-34.2292, -58.7938], // [21]
  [-34.2281, -58.7955], // [22] Arroyo Fermín confluence
  [-34.2276, -58.7962], // [23]
  [-34.2088, -58.8232], // [24]
  [-34.1958, -58.8421], // [25]
  [-34.1908, -58.8468], // [26]
  [-34.1829, -58.8538], // [27] Puerto Campana / Otamendi area
];

// Río Paraná de las Palmas — SE from Carapachay junction toward Capitán junction
// OSM Way 180706120
const PARANA_SE: LatLng[] = [
  [-34.2682, -58.6383], // Carapachay junction
  [-34.269, -58.6336],
  [-34.2704, -58.6243],
  [-34.272, -58.6152],
  [-34.2738, -58.6082],
  [-34.2763, -58.6006],
  [-34.2781, -58.5952],
  [-34.2805, -58.5885], // Paycarabí junction
  [-34.2834, -58.5803],
  [-34.2846, -58.5773],
  [-34.2885, -58.5694],
  [-34.29, -58.5665], // Capitán junction
];

// Canal Gobernador Arias: Paraná/Serna junction → Río Luján junction
// OSM Way 30090978 (reversed, boats go NW→SE from Paraná toward Luján)
const CANAL_ARIAS: LatLng[] = [
  [-34.2648, -58.6491], // Paraná / Canal Serna junction (N)
  [-34.2698, -58.652],
  [-34.2715, -58.6539],
  [-34.2722, -58.6543],
  [-34.295, -58.6622],
  [-34.3177, -58.6699],
  [-34.3296, -58.674],
  [-34.3354, -58.6759],
  [-34.3413, -58.6781],
  [-34.3434, -58.6788],
  [-34.3457, -58.6799],
  [-34.3481, -58.6819],
  [-34.3496, -58.6839],
  [-34.3512, -58.6858],
  [-34.3514, -58.6861], // Río Luján junction (S)
];

// Arroyo Caraguatá: Río Luján/Carapachay junction → NW toward Paraná area
// OSM Way 267255327 (reversed, SE→NW)
const CARAGUATA: LatLng[] = [
  [-34.3844, -58.6324], // Luján/Carapachay junction (SE)
  [-34.3828, -58.6324],
  [-34.3808, -58.6337],
  [-34.3782, -58.6367],
  [-34.3769, -58.6373],
  [-34.3746, -58.6384],
  [-34.3726, -58.6393],
  [-34.3701, -58.6392],
  [-34.3668, -58.6394],
  [-34.3642, -58.6394],
  [-34.3628, -58.64],
  [-34.3605, -58.6404],
  [-34.3579, -58.6414],
  [-34.3559, -58.6447],
  [-34.356, -58.6467],
  [-34.3554, -58.6476],
  [-34.3526, -58.6486],
  [-34.3498, -58.6507],
  [-34.3468, -58.6516],
  [-34.344, -58.6517],
  [-34.3416, -58.6523],
  [-34.3395, -58.6539],
  [-34.3368, -58.6538],
  [-34.3342, -58.6552],
  [-34.3318, -58.6556],
  [-34.3296, -58.6533],
  [-34.3265, -58.6523],
  [-34.3235, -58.6526],
  [-34.3217, -58.6506],
  [-34.3198, -58.6491],
  [-34.3165, -58.6491],
  [-34.3137, -58.6485],
  [-34.3105, -58.6472],
  [-34.3088, -58.6462], // NW end (near Paraná)
];

// Arroyo Paycarabí: Paraná junction → Canal Serna junction (SE → NW)
// OSM Way 286439793 (reversed), sampled every ~15th node
const PAYCARABI: LatLng[] = [
  [-34.2805, -58.5885], // Paraná junction (SE)
  [-34.2763, -58.588],
  [-34.2744, -58.5874],
  [-34.2728, -58.5858],
  [-34.2712, -58.5835],
  [-34.2697, -58.5819],
  [-34.2673, -58.58],
  [-34.2656, -58.5795],
  [-34.2641, -58.5795],
  [-34.2624, -58.5812],
  [-34.2606, -58.5819],
  [-34.2583, -58.5818],
  [-34.2568, -58.5791],
  [-34.2555, -58.579],
  [-34.2545, -58.5781],
  [-34.253, -58.5769],
  [-34.2508, -58.5795],
  [-34.2497, -58.5845],
  [-34.2494, -58.588],
  [-34.2492, -58.5899],
  [-34.2496, -58.5938],
  [-34.2487, -58.5953],
  [-34.2465, -58.5965],
  [-34.244, -58.5976],
  [-34.2418, -58.5977],
  [-34.2394, -58.5971],
  [-34.2369, -58.5962],
  [-34.2337, -58.595],
  [-34.2318, -58.5941],
  [-34.2285, -58.5935],
  [-34.2263, -58.5936],
  [-34.2252, -58.5938],
  [-34.2225, -58.5998],
  [-34.2201, -58.6006],
  [-34.2174, -58.6003],
  [-34.2142, -58.6007],
  [-34.2109, -58.6025],
  [-34.2079, -58.605],
  [-34.2041, -58.6058],
  [-34.2013, -58.6067],
  [-34.1982, -58.6094],
  [-34.1958, -58.6082],
  [-34.1926, -58.6047],
  [-34.1893, -58.602],
  [-34.1846, -58.6001],
  [-34.1794, -58.596],
  [-34.1745, -58.5935],
  [-34.1719, -58.595],
  [-34.1696, -58.5972],
  [-34.168, -58.601],
  [-34.1673, -58.6068], // Canal Serna junction (NW)
];

// Canal Gobernador de la Serna: Paraná/Arias junction → Paycarabí junction
// OSM Way 1027404595 (reversed, SE → NW)
const CANAL_SERNA: LatLng[] = [
  [-34.2648, -58.6491], // Paraná / Canal Arias junction (SE)
  [-34.2574, -58.6444],
  [-34.2518, -58.6412],
  [-34.2454, -58.6377],
  [-34.241, -58.6357],
  [-34.2367, -58.634],
  [-34.2329, -58.6325],
  [-34.2235, -58.6288],
  [-34.2074, -58.6225],
  [-34.2022, -58.6205],
  [-34.1673, -58.6068], // Paycarabí junction (NW)
];

// Muelle Isleño Escobar — on the Río Paraná de las Palmas
// OSM way 869975175 "Muelle puerto Escobar", between PARANA_NW[13] and [14]
const ESCOBAR_DOCK: LatLng[] = [[-34.2468, -58.7309]];

// ═══════════════════════════════════════════════════════════════════
// ROUTE BUILDING
// ═══════════════════════════════════════════════════════════════════

function buildRoute(...segments: LatLng[][]): LatLng[][] {
  return [segments.flat()];
}

function rev(s: LatLng[]): LatLng[] {
  return [...s].reverse();
}

function head(s: LatLng[], n: number): LatLng[] {
  return s.slice(0, n);
}

const defaultRoutes: Record<string, LatLng[][]> = {};

// ─── Helper sub-segments ─────────────────────────────────────────
// PARANA_SE indices: 0=Carapachay, 7=Paycarabí, 11=Capitán
// Capitán → Paycarabí (only the relevant Paraná stretch)
const PARANA_CAP_TO_PAY = rev(PARANA_SE.slice(7));
// Arias/Serna junction → Carapachay → Paycarabí (via Paraná)
const PARANA_ARIAS_TO_PAY = [...rev(PARANA_NW.slice(0, 2)), ...PARANA_SE.slice(1, 8)];

// Common route prefixes
const FROM_STATION = RIO_TIGRE;
const VIA_LUJAN_W = LUJAN_W.slice(1);
const VIA_LUJAN_W2 = LUJAN_W2.slice(1);
const VIA_LUJAN_W3 = LUJAN_W3.slice(1);
const VIA_LUJAN_E = LUJAN_E.slice(1);
const VIA_SARMIENTO = SARMIENTO.slice(1);
const VIA_CAPITAN = CAPITAN.slice(1);
const VIA_CARAPACHAY = CARAPACHAY.slice(1);
const VIA_CANAL_ARIAS_UP = rev(CANAL_ARIAS).slice(1);

// ─── LÍNEA 450 ───────────────────────────────────────────────────
// Via Río Tigre → Luján → Carapachay → Paraná de las Palmas

// Troncal: Est. Fluvial → Carapachay → Paraná NW → Puerto Campana
defaultRoutes['450-troncal'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_CARAPACHAY,
  PARANA_NW.slice(1),
);

// Fraccionado 1: Carapachay parcial (Km 12 / Escuela 13)
defaultRoutes['450-fraccionado1'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  head(CARAPACHAY, 35).slice(1),
);

// Fraccionado 2: Carapachay corto (Río Espera)
defaultRoutes['450-fraccionado2'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  head(CARAPACHAY, 22).slice(1),
);

// Fraccionado 3: Carapachay → Paraná → Canal Serna parcial (Boca Arroyo Durazno)
defaultRoutes['450-fraccionado3'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_CARAPACHAY,
  head(PARANA_NW, 2).slice(1),
  head(CANAL_SERNA, 5).slice(1),
);

// Ramal 1: Carapachay → Paraná → Canal Serna → Boca Arroyo Pacífico
defaultRoutes['450-ramal1'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_CARAPACHAY,
  head(PARANA_NW, 2).slice(1),
  head(CANAL_SERNA, 6).slice(1),
);

// Fraccionado Ramal 1: Carapachay → Paraná → Canal Serna → Boca Arroyo Durazno
defaultRoutes['450-fraccionado-ramal1'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_CARAPACHAY,
  head(PARANA_NW, 2).slice(1),
  head(CANAL_SERNA, 4).slice(1),
);

// ─── LÍNEA 451 ───────────────────────────────────────────────────
// Via Sarmiento → Capitán → Paraná → Paycarabí

// Troncal: Capitán → Paraná (tramo corto) → Paycarabí completo → Paraná Mini
defaultRoutes['451-troncal'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  PAYCARABI.slice(1),
);

// Ramal 1: Capitán → Paraná → Paycarabí parcial → Paraná Mini
defaultRoutes['451-ramal1'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 25).slice(1),
);

// ─── LÍNEA 452 ───────────────────────────────────────────────────
// Via Sarmiento → Capitán → various branches

// Troncal: Capitán → Paraná → Paycarabí largo
defaultRoutes['452-troncal'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 30).slice(1),
);

// Fraccionado: Capitán → Paraná → Paycarabí corto
defaultRoutes['452-fraccionado'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 15).slice(1),
);

// Ramal 1: Sarmiento parcial → Río San Antonio
defaultRoutes['452-ramal1'] = buildRoute(FROM_STATION, VIA_LUJAN_E, head(SARMIENTO, 20).slice(1));

// Ramal 2: Sarmiento parcial → San Antonio → Dorado
defaultRoutes['452-ramal2'] = buildRoute(FROM_STATION, VIA_LUJAN_E, head(SARMIENTO, 24).slice(1));

// Ramal 3: Sarmiento → Capitán parcial (Rama Negra / Toro)
defaultRoutes['452-ramal3'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  head(CAPITAN, 20).slice(1),
);

// Ramal 4: Sarmiento parcial (Arroyo Espera)
defaultRoutes['452-ramal4'] = buildRoute(FROM_STATION, VIA_LUJAN_E, head(SARMIENTO, 12).slice(1));

// Ramal 5: Luján E → Sarmiento corto (Arroyo Abra Vieja)
defaultRoutes['452-ramal5'] = buildRoute(FROM_STATION, VIA_LUJAN_E, head(SARMIENTO, 8).slice(1));

// Ramal 6: Sarmiento → Capitán → Paraná de las Palmas (tramo corto NW)
defaultRoutes['452-ramal6'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1, 4),
);

// Fraccionado 10: Sarmiento parcial → Capitán parcial (Rama Negra)
defaultRoutes['452-fraccionado10'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  head(SARMIENTO, 16).slice(1),
);

// ─── LÍNEA 453 ───────────────────────────────────────────────────
// Various routes via Canal Arias, Caraguatá, Canal Serna

// Ramal 1: Canal Arias → Paraná NW (Carabelas / Canal Alem)
defaultRoutes['453-ramal-1'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  head(PARANA_NW, 6).slice(1),
);

// Ramal 2: Canal Arias → Canal Serna parcial (Canal 4 / Paraná Mini)
defaultRoutes['453-ramal-2'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  head(CANAL_SERNA, 6).slice(1),
);

// Fraccionado Ramal 2: Canal Arias → Canal Serna extendido
defaultRoutes['453-fraccionado-ramal-2'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  head(CANAL_SERNA, 8).slice(1),
);

// Desdoblamiento Ramal 2: Arias → Serna → Paycarabí (desde junction NW)
defaultRoutes['453-desdoblamiento-ramal-2'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  CANAL_SERNA.slice(1),
  rev(PAYCARABI).slice(1).slice(0, 8),
);

// Fraccionado: Canal Arias → Paraná NW parcial (Carabelas / Canal Alem 2da)
defaultRoutes['453-fraccionado'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  head(PARANA_NW, 4).slice(1),
);

// Ramal 3: Caraguatá completo (La Horca / El Banco / Las Animas)
defaultRoutes['453-ramal-3'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  CARAGUATA.slice(1),
);

// Ramal 4: Caraguatá parcial
defaultRoutes['453-ramal-4'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  CARAGUATA.slice(1, 21),
);

// Ramal 5: Canal Arias → Paraná NW parcial (La Horca)
defaultRoutes['453-ramal-5'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  head(PARANA_NW, 5).slice(1),
);

// Desdoblamiento Ramal 5: Via Capitán → Paraná completo → NW
defaultRoutes['453-desdoblamiento-ramal-5'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  rev(PARANA_SE).slice(1),
  head(PARANA_NW, 4).slice(1),
);

// ─── LÍNEA 454 ───────────────────────────────────────────────────

// Troncal: Capitán → Paraná → Paycarabí medio (Canal 5 / Viso)
defaultRoutes['454-troncal'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 20).slice(1),
);

// Fraccionado: Sarmiento → Capitán parcial (Chañá / Cruz)
defaultRoutes['454-fraccionado'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  head(CAPITAN, 20).slice(1),
);

// Desdoblamiento: Canal Arias → Paraná → Paycarabí (Piedras / Pellegrini)
defaultRoutes['454-desdoblamiento'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  PARANA_ARIAS_TO_PAY.slice(1),
  head(PAYCARABI, 15).slice(1),
);

// Ramal 1: Capitán → Paraná → Paycarabí largo (Piedras / Barca Grande)
defaultRoutes['454-ramal-1'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 25).slice(1),
);

// Fraccionado Ramal 1: Capitán → Paraná → Paycarabí parcial (Canal 5)
defaultRoutes['454-fraccionado-ramal-1'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 12).slice(1),
);

// Ramal 2: Capitán → Paraná → Paycarabí medio (Chivitecoy / Piedras)
defaultRoutes['454-ramal-2'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 18).slice(1),
);

// Fraccionado Ramal 2: Sarmiento → Capitán parcial (Arroyo Borches)
defaultRoutes['454-fraccionado-ramal-2'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  head(CAPITAN, 15).slice(1),
);

// Ramal 3: Capitán → Paraná → Paycarabí medio (Piedras / Barca Grande)
defaultRoutes['454-ramal-3'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 22).slice(1),
);

// Ramal 4: Canal Arias → Canal Serna parcial (Chaná / Barca / Correntoso)
defaultRoutes['454-ramal-4'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_W,
  VIA_LUJAN_W2,
  VIA_LUJAN_W3,
  VIA_CANAL_ARIAS_UP,
  head(CANAL_SERNA, 5).slice(1),
);

// Fraccionado Ramal 4: Capitán → Paraná → Paycarabí parcial (Borches / Piedras)
defaultRoutes['454-fraccionado-ramal-4'] = buildRoute(
  FROM_STATION,
  VIA_LUJAN_E,
  VIA_SARMIENTO,
  VIA_CAPITAN,
  PARANA_CAP_TO_PAY.slice(1),
  head(PAYCARABI, 16).slice(1),
);

// ─── LÍNEA 455 ───────────────────────────────────────────────────
// Sale de Muelle Isleño Escobar (sobre el Río Paraná de las Palmas)
// Dock entre PARANA_NW[13] y [14]. Aguas abajo = SE (índices menores), arriba = NW (mayores)
// [1]=Canal Serna jct, [9]=Boca Carabelas, [13-14]=dock, [22]=Arroyo Fermín

// Troncal: Muelle → aguas abajo por Paraná → Canal Serna → El Tropezón
// Duración: 30-40 min
defaultRoutes['455-troncal'] = buildRoute(
  ESCOBAR_DOCK,
  rev(PARANA_NW.slice(1, 14)), // downstream: 13→12→...→1 (Canal Serna junction)
  head(CANAL_SERNA, 3).slice(1), // short way into Canal Serna to El Tropezón
);

// Fraccionado: Muelle → aguas abajo hasta Hospital Boca Carabelas
// Duración: 15 min. Boca Carabelas = PARANA_NW[9] (mouth of Río Carabelas)
defaultRoutes['455-fraccionado'] = buildRoute(
  ESCOBAR_DOCK,
  rev(PARANA_NW.slice(9, 14)), // downstream: 13→12→11→10→9 (Boca Carabelas)
);

// Ramal 1: Muelle → aguas arriba por Paraná → Arroyo Fermín (Isla Cardales)
// Duración: 30 min. Arroyo Fermín confluence = PARANA_NW[22]
defaultRoutes['455-ramal1'] = buildRoute(
  ESCOBAR_DOCK,
  PARANA_NW.slice(14, 23), // upstream: 14→15→...→22 (Arroyo Fermín)
  [
    [-34.226, -58.798], // into Arroyo Fermín channel (OSM way 313713812)
    [-34.2243, -58.8057],
    [-34.222, -58.815],
    [-34.2197, -58.8268],
  ],
);

// ═══════════════════════════════════════════════════════════════════
// MAP MANAGER CLASS
// ═══════════════════════════════════════════════════════════════════

// Haversine distance in km
function haversine(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const sin2 =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(sin2), Math.sqrt(1 - sin2));
}

export function getRouteData(): Record<string, LatLng[][]> {
  return defaultRoutes;
}

export interface RouteMatch {
  serviceId: string;
  distance: number;
  nearestPoint: LatLng;
}

export function findNearestRoutes(target: LatLng, maxResults = 10, maxDistKm = 5): RouteMatch[] {
  const results: RouteMatch[] = [];

  for (const [serviceId, paths] of Object.entries(defaultRoutes)) {
    let minDist = Infinity;
    let closest: LatLng = target;

    for (const path of paths) {
      for (const pt of path) {
        const d = haversine(target, pt);
        if (d < minDist) {
          minDist = d;
          closest = pt;
        }
      }
    }

    if (minDist <= maxDistKm) {
      results.push({ serviceId, distance: minDist, nearestPoint: closest });
    }
  }

  results.sort((a, b) => a.distance - b.distance);
  return results.slice(0, maxResults);
}

const TILE_LIGHT = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

const TILE_DARK = {
  url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
};

export class MapManager {
  private map: L.Map | null = null;
  private currentLayers: L.Layer[] = [];
  private searchLayers: L.Layer[] = [];
  private readonly boatLayers: L.Layer[] = [];
  private tileLayer: L.TileLayer | null = null;
  private readonly defaultCenter: LatLng = [-34.4, -58.65];
  private readonly defaultZoom = 11;

  private onMapClick: ((latlng: LatLng) => void) | null = null;

  init(containerId: string): void {
    this.map = L.map(containerId, {
      zoomControl: false,
    }).setView(this.defaultCenter, this.defaultZoom);

    L.control.zoom({ position: 'topright' }).addTo(this.map);

    this.applyTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.onMapClick) {
        this.onMapClick([e.latlng.lat, e.latlng.lng]);
      }
    });
  }

  applyTheme(theme: 'light' | 'dark'): void {
    if (!this.map) return;
    if (this.tileLayer) {
      this.map.removeLayer(this.tileLayer);
    }
    const cfg = theme === 'dark' ? TILE_DARK : TILE_LIGHT;
    this.tileLayer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 19,
    }).addTo(this.map);
  }

  onTilesLoaded(cb: () => void): void {
    if (!this.tileLayer) return;
    this.tileLayer.once('load', cb);
  }

  setMapClickHandler(handler: ((latlng: LatLng) => void) | null): void {
    this.onMapClick = handler;
  }

  showRoute(serviceId: string, color: string): void {
    this.clearRoutes();
    if (!this.map) return;

    const paths = defaultRoutes[serviceId];
    if (!paths || paths.length === 0) return;

    for (const path of paths) {
      const polyline = L.polyline(path, {
        color,
        weight: 5,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(this.map);
      this.currentLayers.push(polyline);
    }

    const allCoords = paths.flat();
    if (allCoords.length > 0) {
      const start = allCoords[0];
      const end = allCoords.at(-1)!;

      const startMarker = L.circleMarker(start, {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 3,
        fillOpacity: 1,
      }).addTo(this.map);
      this.currentLayers.push(startMarker);

      const endMarker = L.circleMarker(end, {
        radius: 8,
        fillColor: '#fff',
        color,
        weight: 3,
        fillOpacity: 1,
      }).addTo(this.map);
      this.currentLayers.push(endMarker);

      const bounds = L.latLngBounds(allCoords);
      this.map.fitBounds(bounds, { padding: [60, 60], maxZoom: 14 });
    }
  }

  showSearchMarker(point: LatLng, label: string): void {
    this.clearSearch();
    if (!this.map) return;

    const marker = L.marker(point).addTo(this.map);
    marker.bindPopup(`<b>${label}</b>`).openPopup();
    this.searchLayers.push(marker);

    this.map.setView(point, 14);
  }

  clearSearch(): void {
    if (!this.map) return;
    this.searchLayers.forEach((l) => this.map!.removeLayer(l));
    this.searchLayers = [];
  }

  clearRoutes(): void {
    if (!this.map) return;
    this.currentLayers.forEach((l) => this.map!.removeLayer(l));
    this.currentLayers = [];
  }

  resetView(): void {
    this.clearRoutes();
    this.clearSearch();
    this.map?.setView(this.defaultCenter, this.defaultZoom);
  }

  showBoats(
    boats: {
      lineId: number;
      lineColor: string;
      position: LatLng;
      serviceType: string;
      direction: string;
      departureTime: string;
      destination: string;
    }[],
  ): void {
    this.clearBoats();
    if (!this.map) return;

    for (const boat of boats) {
      const dirArrow = boat.direction === 'ida' ? '→' : '←';
      const icon = L.divIcon({
        className: '',
        html: `<div class="boat-marker" style="background:${boat.lineColor};">
          <span class="boat-marker-num">${boat.lineId}</span>
          <div class="boat-marker-pulse" style="border-color:${boat.lineColor};"></div>
        </div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(boat.position, { icon, interactive: true, zIndexOffset: 1000 }).addTo(
        this.map,
      );

      marker.bindPopup(
        `<div style="font-family:Outfit,sans-serif;min-width:140px;">
          <div style="font-weight:700;font-size:13px;color:#1a2332;margin-bottom:4px;">Línea ${boat.lineId}</div>
          <div style="font-size:11px;color:#5a6578;margin-bottom:2px;">${boat.serviceType}</div>
          <div style="font-size:11px;color:#5a6578;">${dirArrow} ${boat.destination}</div>
          <div style="font-size:10px;color:#8d95a3;margin-top:4px;">Salió a las ${boat.departureTime}</div>
        </div>`,
        { closeButton: false, offset: [0, -8] },
      );

      this.boatLayers.push(marker);
    }
  }

  clearBoats(): void {
    if (!this.map) return;
    this.boatLayers.forEach((l) => this.map!.removeLayer(l));
    this.boatLayers.length = 0;
  }

  invalidateSize(): void {
    this.map?.invalidateSize();
  }
}
