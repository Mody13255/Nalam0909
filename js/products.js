/* ==========================================================================
   NALAM — Brand configuration, delivery rules and product catalogue
   ========================================================================== */

window.NALAM_CONFIG = {
  brandNameEn: 'Nalam',
  brandNameAr: 'نالام',
  slogan: 'Your Zone Is Glam.',
  sloganAr: 'مساحتك بأناقة فاخرة.',
  siteUrl: 'https://mody13255.github.io/Nalam-website/',
  phoneDisplay: '+20 11 32284750',
  phoneE164: '+201132284750',
  whatsappNumber: '201132284750',
  instapayHandle: 'nalam@instapay',
  mapsUrl: 'https://maps.app.goo.gl/vt4eZUMmj4ZkwLQM6',
  mapsEmbedUrl: 'https://maps.google.com/maps?q=New%20Cairo,%20Cairo%20Governorate,%20Egypt&t=&z=13&ie=UTF8&iwloc=&output=embed',
  instagramUrl: 'https://www.instagram.com/nalam.kitchen.dressingroom/',
  showroomHoursEn: 'Daily: 11:00 AM – 10:00 PM (Showroom & Consultations)',
  showroomHoursAr: 'يومياً: 11:00 صباحاً – 10:00 مساءً (المعرض والاستشارات)',
  addressEn: 'Nalam Showroom, Fifth Settlement, New Cairo, Egypt',
  addressAr: 'معرض نالام، التجمع الخامس، القاهرة الجديدة، مصر',
  baseDeliveryFeeEgp: 5000,
  includedMaxFloor: 2,
  deliveryGovernorates: ['Cairo', 'Giza'],
  maxFloor: 12,
  metaPixelId: 'YOUR_PIXEL_ID_HERE',
  googleSheetWebhookUrl: ''
};

window.NALAM_CATEGORIES = [
  { id: 'all',           en: 'All',           ar: 'الكل' },
  { id: 'bed',           en: 'Bed',           ar: 'سرير' },
  { id: 'dressing',      en: 'Dressing',      ar: 'دريسينج روم' },
  { id: 'kitchens',      en: 'Kitchens',      ar: 'مطابخ' },
  { id: 'vanity',        en: 'Vanity',        ar: 'فانيتي / تسريحة' },
  { id: 'nightstand',    en: 'Nightstand',    ar: 'كومود' },
  { id: 'bedrooms',      en: 'Bedrooms',      ar: 'غرف نوم' },
  { id: 'coffee-corner', en: 'Coffee Corner', ar: 'كوفي كورنر' },
  { id: 'shoe-cabinets', en: 'Shoe Cabinets', ar: 'جزامات' },
  { id: 'wc-units',      en: 'WC Units',      ar: 'وحدات حمام' }
];

window.NALAM_PRODUCTS = [
  {
    id: 'bed-aura-king',
    category: 'bed',
    code: 'NLM-BD-01',
    titleEn: 'Aura Upholstered King Bed',
    titleAr: 'سرير أورا كينج منجد',
    dimensions: '200 × 215 × 125 cm',
    priceEgp: 28500,
    materialEn: '16mm warp-resistant melamine-faced blockboard engineered with minimal gaps, bouclé headboard and solid beech slats.',
    materialAr: 'كونتر ميلامين مقاوم للتقوس 16 مم بتقفيل دقيق وأقل فراغات ممكنة، مع ظهر منجد بوكليه وملل زان طبيعي.',
    hardwareEn: 'Heavy-duty hydraulic lift storage option • Turkish SAMET fittings',
    hardwareAr: 'إمكانية إضافة ميكانيزم تخزين هيدروليك • إكسسوارات SAMET تركي',
    finishEn: 'Warm Sand Bouclé & Natural Oak',
    finishAr: 'بوكليه رملي دافئ وبلوط طبيعي',
    images: [
      { src: 'assets/products/bed-aura-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/bed-aura-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/bed-aura-3.jpg', labelEn: 'Open Storage View', labelAr: 'التخزين الداخلي' },
      { src: 'assets/products/bed-aura-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل الخامة' }
    ]
  },
  {
    id: 'dressing-lumiere-walkin',
    category: 'dressing',
    code: 'NLM-DR-01',
    titleEn: 'Lumière Walk-In Dressing Suite',
    titleAr: 'دريسينج روم لوميير متكامل',
    dimensions: '320 × 60 × 260 cm (Custom)',
    priceEgp: 94000,
    materialEn: '16mm warp-resistant melamine-faced blockboard with minimal-gap precision joinery, smoked bronze glass doors and warm LED profiles.',
    materialAr: 'كونتر ميلامين مقاوم للتقوس 16 مم بتقفيل دقيق وأقل فراغات ممكنة مع ضلف زجاج برونزي وإضاءة ليد دافئة.',
    hardwareEn: 'Turkish SAMET soft-close hinges • Italian FGV undermount soft-close drawer runners',
    hardwareAr: 'مفصلات SAMET تركي سوفت كلوز • مجر أدراج سفلية FGV إيطالي سوفت كلوز',
    finishEn: 'Cashmere Taupe & Walnut Veneer',
    finishAr: 'كشمير توب وقشرة جوز طبيعي',
    images: [
      { src: 'assets/products/dressing-lumiere-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/dressing-lumiere-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/dressing-lumiere-3.jpg', labelEn: 'Open Interior / Hardware', labelAr: 'التقسيم الداخلي' },
      { src: 'assets/products/dressing-lumiere-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل الإضاءة والمجر' }
    ]
  },
  {
    id: 'kitchen-verona-lshape',
    category: 'kitchens',
    code: 'NLM-KT-01',
    titleEn: 'Verona Bespoke Kitchen & Island',
    titleAr: 'مطبخ فيرونا مع جزيرة وسطية',
    dimensions: 'Custom Layout • Height 260 cm (incl. 10 cm top filler)',
    priceEgp: 189000,
    materialEn: 'Kitchen spec: ultra-glossy or matte fronts over Good Wood / Top Wood sandwich blockboard carcasses, with a 100% water-resistant Boardium sink unit.',
    materialAr: 'مواصفات المطابخ: ضلف ألترا جلوسي أو مط على علب كونتر جود وود / توب وود، مع وحدة حوض بورديوم 100% مقاومة للمياه.',
    hardwareEn: 'Turkish SAMET soft-close hinges • Italian FGV undermount soft-close runners • Installation included',
    hardwareAr: 'مفصلات SAMET تركي سوفت كلوز • مجر سفلية FGV إيطالي • السعر شامل التركيب',
    finishEn: 'Sage Architectural Matte & Veined Quartz',
    finishAr: 'أخضر سيج مطفي وكوارتز أبيض معرق',
    images: [
      { src: 'assets/products/kitchens-verona-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/kitchens-verona-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/kitchens-verona-3.jpg', labelEn: 'Open Interior / Hardware', labelAr: 'الأدراج والمفصلات' },
      { src: 'assets/products/kitchens-verona-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل الكوارتز والليد' }
    ]
  },
  {
    id: 'vanity-solis-makeup',
    category: 'vanity',
    code: 'NLM-VN-01',
    titleEn: 'Solis Illuminated Dressing Vanity',
    titleAr: 'تسريحة سوليس بإضاءة مدمجة',
    dimensions: '140 × 48 × 78 cm',
    priceEgp: 19500,
    materialEn: '16mm warp-resistant melamine-faced blockboard with minimal-gap joinery, fluted drawer fronts and velvet jewellery dividers.',
    materialAr: 'كونتر ميلامين مقاوم للتقوس 16 مم بواجهات مضلعة وتقفيل دقيق وتقسيم مخملي للمجوهرات مع مرآة ليد.',
    hardwareEn: 'Italian FGV undermount soft-close runners • Brushed champagne gold pulls',
    hardwareAr: 'مجر سفلية FGV إيطالي سوفت كلوز • مقابض شامبين جولد مطفي',
    finishEn: 'Cream Cashmere & Champagne Brass',
    finishAr: 'كريم كشمير ونحاس شامبين',
    images: [
      { src: 'assets/products/vanity-solis-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/vanity-solis-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/vanity-solis-3.jpg', labelEn: 'Open Drawer / Dividers', labelAr: 'تقسيم الأدراج الداخلي' },
      { src: 'assets/products/vanity-solis-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل التشطيب' }
    ]
  },
  {
    id: 'nightstand-noor-fluted',
    category: 'nightstand',
    code: 'NLM-NS-01',
    titleEn: 'Noor Fluted Two-Drawer Nightstand',
    titleAr: 'كومود نور بدرجين بواجهة مضلعة',
    dimensions: '55 × 42 × 52 cm',
    priceEgp: 7800,
    materialEn: '16mm warp-resistant melamine-faced blockboard with minimal-gap seams and an architectural recessed top.',
    materialAr: 'كونتر ميلامين مقاوم للتقوس 16 مم بتقفيل متقن وأقل فراغات مع سطح غاطس أنيق.',
    hardwareEn: 'Italian FGV undermount soft-close runners • Concealed finger-pull profile',
    hardwareAr: 'مجر سفلية FGV إيطالي سوفت كلوز • جروف فتح مخفية',
    finishEn: 'Warm Beige & Smoked Oak',
    finishAr: 'بيج دافئ وبلوط مدخن',
    images: [
      { src: 'assets/products/nightstand-noor-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/nightstand-noor-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/nightstand-noor-3.jpg', labelEn: 'Open Drawers / Hardware', labelAr: 'الأدراج والمجر' },
      { src: 'assets/products/nightstand-noor-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل السطح' }
    ]
  },
  {
    id: 'bedrooms-serene-suite',
    category: 'bedrooms',
    code: 'NLM-BR-01',
    titleEn: 'Serene Master Bedroom Complete Suite',
    titleAr: 'غرفة نوم ماستر سيرين كاملة',
    dimensions: 'King Bed + 2 Nightstands + 240 cm Wardrobe + Vanity',
    priceEgp: 118000,
    materialEn: 'Rooms spec: 16mm warp-resistant melamine-faced blockboard precision-joined with minimal gaps and tailored to your room.',
    materialAr: 'مواصفات الغرف: كونتر ميلامين مقاوم للتقوس 16 مم بتقفيل دقيق وأقل فراغات ممكنة ومفصل حسب مقاسات غرفتك.',
    hardwareEn: 'Turkish SAMET soft-close hinges • Italian FGV undermount soft-close runners',
    hardwareAr: 'مفصلات SAMET تركي سوفت كلوز • مجر سفلية FGV إيطالي سوفت كلوز',
    finishEn: 'Sand Linen & Warm Walnut',
    finishAr: 'لينن رملي وجوز دافئ',
    images: [
      { src: 'assets/products/bedrooms-serene-1.jpg', labelEn: 'Front View', labelAr: 'منظور الغرفة الكامل' },
      { src: 'assets/products/bedrooms-serene-2.jpg', labelEn: 'Wardrobe Angle View', labelAr: 'زاوية الدولاب' },
      { src: 'assets/products/bedrooms-serene-3.jpg', labelEn: 'Open Interior / Hardware', labelAr: 'التقسيم الداخلي' },
      { src: 'assets/products/bedrooms-serene-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل الخامات' }
    ]
  },
  {
    id: 'coffee-corner-barista',
    category: 'coffee-corner',
    code: 'NLM-CC-01',
    titleEn: 'Barista Luxury Coffee Corner Unit',
    titleAr: 'كوفي كورنر باريستا فاخر',
    dimensions: '140 × 50 × 210 cm',
    priceEgp: 26500,
    materialEn: '16mm warp-resistant melamine-faced blockboard with a minimal-gap finish, heat-resistant quartz counter and backlit glass shelves.',
    materialAr: 'كونتر ميلامين مقاوم للتقوس 16 مم مع سطح كوارتز مقاوم للحرارة وأرفف زجاجية مضاءة.',
    hardwareEn: 'Turkish SAMET soft-close hinges • Italian FGV undermount soft-close runners',
    hardwareAr: 'مفصلات SAMET تركي سوفت كلوز • مجر سفلية FGV إيطالي سوفت كلوز',
    finishEn: 'Espresso Walnut & Champagne Gold',
    finishAr: 'جوز إسبريسو وشامبين جولد',
    images: [
      { src: 'assets/products/coffee-corner-barista-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/coffee-corner-barista-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/coffee-corner-barista-3.jpg', labelEn: 'Open Storage / Hardware', labelAr: 'التخزين الداخلي' },
      { src: 'assets/products/coffee-corner-barista-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل الكوارتز والليد' }
    ]
  },
  {
    id: 'shoe-cabinets-atelier',
    category: 'shoe-cabinets',
    code: 'NLM-SC-01',
    titleEn: 'Atelier Full-Height Entryway Shoe Cabinet',
    titleAr: 'جزامة أتيليه ارتفاع كامل للمدخل',
    dimensions: '120 × 38 × 220 cm',
    priceEgp: 21000,
    materialEn: '16mm warp-resistant melamine-faced blockboard with minimal-gap doors, ventilated angled shelves and top storage.',
    materialAr: 'كونتر ميلامين مقاوم للتقوس 16 مم مع أرفف مائلة بفتحات تهوية وتخزين علوي.',
    hardwareEn: 'Turkish SAMET soft-close hinges • Concealed handleless shadow-gap groove',
    hardwareAr: 'مفصلات SAMET تركي سوفت كلوز • جروف فتح مخفي بدون مقابض',
    finishEn: 'Warm Taupe & Natural Walnut',
    finishAr: 'توب دافئ وجوز طبيعي',
    images: [
      { src: 'assets/products/shoe-cabinets-atelier-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/shoe-cabinets-atelier-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/shoe-cabinets-atelier-3.jpg', labelEn: 'Open Interior / Shelves', labelAr: 'الأرفف الداخلية' },
      { src: 'assets/products/shoe-cabinets-atelier-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل الجروف' }
    ]
  },
  {
    id: 'wc-units-boardium-spa',
    category: 'wc-units',
    code: 'NLM-WC-01',
    titleEn: 'Spa Floating Boardium WC Vanity Unit',
    titleAr: 'وحدة حمام سبا معلقة (بورديوم)',
    dimensions: '100 × 50 × 55 cm',
    priceEgp: 17500,
    materialEn: '100% water-resistant Boardium core engineered for high-humidity bathrooms, paired with a quartz sink top.',
    materialAr: 'خامة بورديوم مقاومة للمياه والرطوبة بنسبة 100% مخصصة للحمامات مع رخام كوارتز.',
    hardwareEn: 'Moisture-protected Turkish SAMET hinges • Italian FGV undermount soft-close runners',
    hardwareAr: 'مفصلات SAMET تركي مقاومة للرطوبة • مجر سفلية FGV إيطالي سوفت كلوز',
    finishEn: 'Stone Beige Matte & Brushed Gold',
    finishAr: 'بيج حجري مطفي وذهبي مطفي',
    images: [
      { src: 'assets/products/wc-units-spa-1.jpg', labelEn: 'Front View', labelAr: 'واجهة أمامية' },
      { src: 'assets/products/wc-units-spa-2.jpg', labelEn: 'Side / Angle View', labelAr: 'زاوية جانبية' },
      { src: 'assets/products/wc-units-spa-3.jpg', labelEn: 'Open Drawer / Siphon Cutout', labelAr: 'تقسيم الدرج والسباكة' },
      { src: 'assets/products/wc-units-spa-4.jpg', labelEn: 'Detail View', labelAr: 'تفاصيل البورديوم' }
    ]
  }
];
