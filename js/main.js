/* ==========================================================================
   NALAM — Storefront interactions
   Cart, wishlist, accounts, checkout, catalogue, language and motion
   ========================================================================== */

(function () {
  'use strict';

  var CFG = window.NALAM_CONFIG || {};
  var PRODUCTS = Array.isArray(window.NALAM_PRODUCTS) ? window.NALAM_PRODUCTS : [];
  var CATEGORIES = Array.isArray(window.NALAM_CATEGORIES) ? window.NALAM_CATEGORIES : [];
  var PRODUCT_MAP = new Map(PRODUCTS.map(function (p) { return [p.id, p]; }));
  var CATEGORY_MAP = new Map(CATEGORIES.map(function (c) { return [c.id, c]; }));

  var STORE_KEYS = {
    lang: 'nalam.lang.v3',
    cart: 'nalam.cart.v3',
    wishlist: 'nalam.wishlist.v3',
    accounts: 'nalam.accounts.v3',
    session: 'nalam.session.v3'
  };

  var PHOTO_CACHE = new Map();
  var MAX_QTY = 20;
  var REDUCED_MOTION = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var state = {
    lang: 'en',
    cart: [],
    wishlist: [],
    accounts: [],
    sessionId: '',
    pendingCheckout: false,
    activeCategory: 'all',
    currentProductId: '',
    modalQty: 1,
    authMode: 'signin',
    lastFocus: null,
    heroStage: -1,
    processStage: -1,
    lastOrder: null
  };

  var refs = {};

  /* ------------------------------------------------------------------------
     Language
     ------------------------------------------------------------------------ */

  var AR = {
    page_title: 'نالام — مطابخ ودريسينج روم وأثاث فاخر حسب الطلب | القاهرة الجديدة',
    nav_showcase: 'المعرض',
    nav_stages: 'مراحل التنفيذ',
    nav_catalogue: 'الكاتالوج',
    nav_materials: 'الخامات والإكسسوارات',
    nav_contact: 'اتصل بنا',
    nav_wa: 'واتساب',
    nav_wishlist: 'المفضلة',
    nav_delivery: 'وعد التوصيل',
    lang_btn: 'English',
    announcement_text: '<strong>5,000 جنيه مصري فقط</strong> للتوصيل والتركيب الاحترافي في القاهرة والجيزة.',
    announcement_link: 'تفاصيل وعد التوصيل',
    hero_eyebrow: 'معرض القاهرة الجديدة المعماري',
    hero_title_1: 'شاهد المساحة',
    hero_title_em: 'تنبض بالحياة',
    hero_lead: 'من مساحة فارغة إلى مطبخ لا ترغب في مغادرته. تابع ست مراحل من تنفيذ نالام، ثم ادخل إلى الكاتالوج.',
    hero_stage_0_title: 'اللوحة الفارغة',
    hero_stage_0_desc: 'كل مشروع نالام يبدأ من فراغك، يُقاس بالمليمتر قبل أن يُرسم أي خط.',
    hero_stage_1_title: 'القاعدة تتشكّل',
    hero_stage_1_desc: 'تُجهّز الوحدات السفلية المقاومة للرطوبة وتُضبط وتُستوى بدقة مع حدود الغرفة.',
    hero_stage_2_title: 'معمارية بارتفاع كامل',
    hero_stage_2_desc: 'الأبراج ووحدات التخزين الممتدة من الأرض للسقف تصنع جداراً متناسقاً يعمل بقدر ما يبدو جميلاً.',
    hero_stage_3_title: 'الوحدات العلوية',
    hero_stage_3_desc: 'تضيف الوحدات العلوية وإضاءة الليد الدافئة عمقاً وطبقات من الضوء تماماً كما اعتمدت في التصميم ثلاثي الأبعاد.',
    hero_stage_4_title: 'تركيب الأجهزة',
    hero_stage_4_desc: 'تُركّب الأجهزة المدمجة والحوض والإكسسوارات بدقة ملليمترية وتُختبر داخل الموقع.',
    hero_stage_5_title: 'اللحظة الأخيرة',
    hero_stage_5_desc: 'أخضر سيج مطفي وكوارتز معرق وإضاءة دافئة تجتمع معاً — مطبخ نالام مكتمل وجاهز للسكن.',
    hero_cta_cat: 'استكشف الكاتالوج',
    hero_cta_book: 'احجز زيارة للمعرض',
    hero_chip_1: 'ضمان 5 سنوات',
    hero_chip_2: 'توصيل ثابت 5,000 جنيه',
    hero_chip_3: 'إنستاباي والمحفظة الإلكترونية',
    stage_live: 'تصميم 3D مباشر',
    stage_location: 'القاهرة الجديدة',
    stage_caption_kicker: 'بناء نالام',
    hero_scroll_cue: 'مرّر لتكتمل تفاصيل المطبخ',
    trust_1_title: 'ضمان 5 سنوات',
    trust_1_sub: 'تغطية كاملة للهيكل والإكسسوارات',
    trust_2_title: 'توصيل ثابت 5,000 جنيه',
    trust_2_sub: 'القاهرة والجيزة، والتركيب مشمول',
    trust_3_title: 'إنستاباي والمحفظة',
    trust_3_sub: 'دفع بسيط دون بطاقات',
    trust_4_title: 'تصميم 3D مخصص',
    trust_4_sub: 'شاهد النتيجة قبل التنفيذ',
    process_eyebrow: 'رحلة نالام',
    process_title: 'من أول رسم إلى <em>اللحظة الأخيرة.</em>',
    process_lead: 'كل مشروع يتبع نفس الانضباط الهادئ: نستمع بدقة، نرسم بدقة، ننفذ بصدق، ونركّب بعناية. تابع مشروعاً من الورشة إلى الغرفة.',
    process_badge: 'داخل الأتيليه',
    process_step_1_num: 'الخطوة 01 — التصميم',
    process_step_1_title: 'قياس ونمذجة واعتماد.',
    process_step_1_desc: 'نزور مساحتك ونسجل كل ملليمتر ونحوّل طريقة حياتك إلى تصميم ثلاثي الأبعاد كامل. ترى التخزين والإضاءة والتفاصيل قبل أن يُقطع أي لوح.',
    process_tag_1a: 'زيارة وقياس',
    process_tag_1b: 'تصميم ثلاثي الأبعاد',
    process_tag_1c: 'تعديلات غير محدودة',
    process_step_2_num: 'الخطوة 02 — الخامات',
    process_step_2_title: 'ألواح مختارة لطريقة حياتك.',
    process_step_2_desc: 'علب المطابخ تحصل على كونتر مقاوم للرطوبة، والحمامات على بورديوم مقاوم للمياه 100%. تلمس كل تشطيب وحرف ومقبض في المعرض قبل الاعتماد.',
    process_tag_2a: 'كونتر 16 مم',
    process_tag_2b: 'بورديوم للمناطق الرطبة',
    process_tag_2c: 'SAMET وFGV',
    process_step_3_num: 'الخطوة 03 — التنفيذ',
    process_step_3_title: 'قص وتقفيل وتجميع داخلي.',
    process_step_3_desc: 'تقص ورشتنا وتقفّل وتجمّع كل وحدة بأقل فراغات ممكنة، مع تجربة الإكسسوارات جافة. كل درج ومفصلة يُختبر قبل مغادرة طاولة العمل.',
    process_tag_3a: 'تقفيل دقيق',
    process_tag_3b: 'تجميع تجريبي',
    process_tag_3c: 'اختبار الإكسسوارات',
    process_step_4_num: 'الخطوة 04 — التركيب',
    process_step_4_title: 'توصيل وتركيب وكشف.',
    process_step_4_desc: 'يحمي فريق التركيب أرضياتك ويضبط كل خط ويُنهي الإضاءة والإكسسوارات في الموقع. نسلّم غرفة نظيفة ودليل عناية وضماناً لخمس سنوات.',
    process_tag_4a: 'تركيب احترافي',
    process_tag_4b: 'تنظيف الموقع',
    process_tag_4c: 'ضمان 5 سنوات',
    process_caption_0_title: 'التصميم والمعاينة 3D',
    process_caption_0_sub: 'المرحلة 01 — قياس ونمذجة واعتماد',
    process_caption_1_title: 'اختيار الخامات',
    process_caption_1_sub: 'المرحلة 02 — تشطيبات وإكسسوارات',
    process_caption_2_title: 'التنفيذ في الورشة',
    process_caption_2_sub: 'المرحلة 03 — قص وتجميع واختبار',
    process_caption_3_title: 'التسليم والتركيب',
    process_caption_3_sub: 'المرحلة 04 — تركيب وضمان',
    spotlight_eyebrow: 'تجوّل في الغرفة',
    spotlight_title: 'شاهد التشطيب وهو يتحرك.',
    spotlight_quote: '«المطبخ يجب أن يبدو هادئاً قبل أن يبدو مبهراً. نصمم الضوء والوصول والإيقاع أولاً، ثم نختار الحجر.»',
    spotlight_credit: '— استوديو تصميم نالام، القاهرة الجديدة',
    catalogue_eyebrow: 'المجموعة',
    catalogue_title: 'قطع صُنعت <em>لأن تُعاش.</em>',
    catalogue_lead: 'نقطة بداية مدروسة، وليست حداً. كل قطعة تُصنع حسب الطلب ويمكن تعديل مقاسها أو تشطيبها أو إعادة تصورها لغرفتك. الأسعار تشمل التركيب الاحترافي في القاهرة والجيزة.',
    catalogue_note: 'قطعة · تُصنع حسب الطلب',
    catalogue_foot_1: 'كل قطعة تُصنع حسب الطلب',
    catalogue_foot_2: 'مقاسات وتشطيبات مخصصة',
    catalogue_foot_3: 'توصيل ثابت 5,000 جنيه',
    catalogue_foot_4: 'ضمان 5 سنوات',
    materials_eyebrow: 'الخامات والإكسسوارات',
    materials_title: 'الأجزاء التي <em>لا تراها.</em>',
    materials_lead: 'الباب الجميل سهل. أما الخزانة التي تبقى صامتة ومستقيمة وناعمة بعد عشر سنوات فهي الحرفة الحقيقية. هذا ما يقف خلف كل تشطيب نالام.',
    material_1_scope: 'غرف النوم والدريسينج',
    material_1_title: 'كونتر 16 مم مقاوم للتقوس',
    material_1_desc: 'كونتر مكسو بالميلامين بهيكل مستقر وأقل فراغات ممكنة، لتبقى خطوط الدولاب الطويلة مستقيمة والأبواب محاذية دائماً.',
    material_2_scope: 'المطابخ',
    material_2_title: 'علب مطابخ مقاومة للرطوبة',
    material_2_desc: 'كونتر جود وود وتوب وود ساندويتش مع وحدة حوض بورديوم مقاومة للمياه 100%، مصممة للبخار والانسكابات والغسيل اليومي.',
    material_3_scope: 'المناطق الرطبة',
    material_3_title: 'بورديوم مقاوم للمياه 100%',
    material_3_desc: 'قلب مخصص للحمامات يقاوم الرطوبة والرشاش، مع أسطح كوارتز وإكسسوارات محمية من الرطوبة.',
    material_4_scope: 'الإكسسوارات',
    material_4_title: 'SAMET التركي وFGV الإيطالي',
    material_4_desc: 'مفصلات سوفت كلوز ومجرات سفلية مختارة لحركة ناعمة وعمر خدمة طويل، تُختبر قطعة بقطعة قبل التركيب.',
    material_5_scope: 'الإضاءة',
    material_5_title: 'بروفايلات ليد دافئة مدمجة',
    material_5_desc: 'بروفايلات مخفية وقابلة للتعتيم تغمر أسطح العمل ودواخل الدولاب بضوء ناعم دون وهج أو قطع ظاهرة.',
    warranty_1_title: 'ضمان 5 سنوات',
    warranty_1_sub: 'تغطية الهيكل والإكسسوارات',
    warranty_2_title: 'تركيب احترافي',
    warranty_2_sub: 'مشمول مع كل طلب في القاهرة والجيزة',
    warranty_3_title: 'عناية بعد البيع',
    warranty_3_sub: 'ضبط وقطع غيار وزيارات صيانة عند الطلب',
    delivery_eyebrow: 'وعد التوصيل',
    delivery_title: 'سعر واحد ثابت. <em>دون مفاجآت.</em>',
    delivery_note: 'التوصيل والتركيب الاحترافي بسعر ثابت 5,000 جنيه مصري في أي مكان بالقاهرة والجيزة (حتى الدور الثاني) ينطبق على أي حجم طلب، سواء قطعة واحدة أو غرف كاملة.',
    delivery_bullet_1: 'نفس رسوم 5,000 جنيه مصري سواء طلبت كومود واحداً أو منزلاً كاملاً.',
    delivery_bullet_2: 'التركيب الاحترافي والضبط وضبط الإكسسوارات مشمولة.',
    delivery_bullet_3: 'رقم الدور مطلوب للتنظيم اللوجستي فقط — وليس لرسوم إضافية.',
    delivery_bullet_4: 'الدفع عبر إنستاباي أو المحفظة الإلكترونية، ويؤكده فريقنا على واتساب.',
    delivery_cta: 'ابدأ طلبك',
    delivery_card_label: 'توصيل بسعر ثابت',
    delivery_card_badge: 'القاهرة والجيزة',
    delivery_card_sub: 'التركيب الاحترافي مشمول · حتى الدور الثاني',
    delivery_card_row_1: 'التوصيل والتركيب',
    delivery_card_row_1_val: '5,000 جنيه',
    delivery_card_row_2: 'رسوم إضافية للدور',
    delivery_card_row_2_val: '0 جنيه',
    delivery_card_row_3: 'حد لحجم الطلب',
    delivery_card_row_3_val: 'لا يوجد',
    delivery_badge_strong: 'توصيل بسعر ثابت:',
    delivery_badge_text: 'نفس رسوم 5,000 جنيه مصري سواء طلبت قطعة واحدة أو غرفة كاملة.',
    faq_eyebrow: 'معلومات مفيدة',
    faq_title: 'أسئلة، <em>وأجوبة.</em>',
    faq_lead: 'كل ما تحتاجه قبل الطلب. إذا لم تجد سؤالك، يرد فريقنا على واتساب خلال ساعات المعرض.',
    faq_contact_label: 'ما زلت تفكر؟',
    faq_contact_link: 'تحدث إلى مصمم',
    faq_q1: 'كيف يعمل التوصيل الثابت بـ 5,000 جنيه؟',
    faq_a1: 'رسوم ثابتة واحدة 5,000 جنيه مصري تغطي التوصيل والتركيب الاحترافي في أي مكان بالقاهرة والجيزة حتى الدور الثاني. نفس الرسوم تنطبق سواء كان طلبك كومود واحداً أو غرفة كاملة. لا توجد رسوم إضافية للدور؛ نطلب رقم الدور فقط ليصل فريق التركيب مستعداً.',
    faq_q2: 'هل يمكنني الطلب دون إنشاء حساب؟',
    faq_a2: 'نعم. يمكنك إضافة القطع إلى السلة وحفظ المفضلة دون تسجيل دخول. الحساب مطلوب فقط عند تأكيد الطلب، حتى نحفظ تاريخ طلباتك وبيانات التوصيل وسجل الضمان في مكان واحد. إذا سجلت الدخول عند الدفع، تعود سلتك كما تركتها.',
    faq_q3: 'كيف أدفع عبر إنستاباي أو المحفظة؟',
    faq_a3: 'اختر إنستاباي أو المحفظة الإلكترونية في السلة، أكّد طلبك، وسنرسل ملخصاً ثنائي اللغة على واتساب. يرد فريقنا ببيانات الدفع ويؤكد موعد التصنيع. لا نجمع بيانات البطاقات على هذا الموقع.',
    faq_q4: 'هل أسعار الكاتالوج نهائية؟',
    faq_a4: 'أسعار الكاتالوج نقطة بداية شفافة للمقاس والتشطيب المذكورين، وتشمل التركيب. قد تغيّر المقاسات المخصصة أو الأحجار الفاخرة أو الوحدات الإضافية السعر النهائي. نؤكد كل تفصيلة كتابةً قبل بدء التصنيع.',
    faq_q5: 'ماذا يغطي ضمان الخمس سنوات؟',
    faq_a5: 'يغطي الضمان الهيكل والإكسسوارات الموردة تحت الاستخدام المنزلي الطبيعي، ويشمل ضبط المفصلات والمجرات وعيوب التصنيع والثبات الإنشائي. لا يغطي التلف العرضي أو أضرار المياه من مصادر خارجية أو التآكل الطبيعي للأقمشة.',
    faq_q6: 'هل يمكنني زيارة المعرض قبل الطلب؟',
    faq_a6: 'يسعدنا ذلك. معرض القاهرة الجديدة مفتوح يومياً من 11:00 صباحاً حتى 10:00 مساءً. اتصل أو راسلنا لحجز استشارة، وأحضر مقاسات الغرفة أو المخطط إن أمكن.',
    contact_eyebrow: 'زيارة أو حديث',
    contact_title: 'لنصمم <em>مساحتك.</em>',
    contact_lead: 'احجز استشارة في المعرض، أرسل مخططك، أو أخبرنا بما تحلم به. سيرد مصمم بالخطوة العملية التالية.',
    showroom_title: 'معرض القاهرة الجديدة',
    showroom_open: 'مفتوح يومياً',
    showroom_address_label: 'العنوان',
    showroom_address: 'معرض نالام، التجمع الخامس، القاهرة الجديدة، مصر',
    showroom_phone_label: 'الهاتف وواتساب',
    showroom_hours_label: 'ساعات المعرض',
    showroom_hours: 'يومياً: 11:00 صباحاً – 10:00 مساءً (المعرض والاستشارات)',
    showroom_orders_label: 'الطلبات والتوصيل',
    showroom_orders: 'توصيل ثابت 5,000 جنيه في القاهرة والجيزة، والتركيب مشمول',
    showroom_map_cta: 'افتح في خرائط جوجل',
    contact_form_title: 'اطلب استشارة',
    contact_form_sub: 'أخبرنا قليلاً عن الغرفة. نرد على واتساب خلال ساعات المعرض.',
    form_name: 'الاسم الكامل',
    form_phone: 'رقم الهاتف',
    form_governorate: 'المحافظة',
    form_select: 'اختر…',
    gov_cairo: 'القاهرة',
    gov_giza: 'الجيزة',
    form_interest: 'مهتم بـ',
    interest_kitchen: 'مطبخ',
    interest_dressing: 'دريسينج روم',
    interest_bedroom: 'غرفة نوم',
    interest_full: 'منزل كامل',
    interest_other: 'أخرى',
    form_message: 'رسالتك <span>(اختياري)</span>',
    form_submit: 'أرسل عبر واتساب',
    form_note: 'بالإرسال توافق على التواصل معك بخصوص استفسارك. لا تُجمع بيانات البطاقات على هذا الموقع.',
    form_success: 'شكراً — رسالتك جاهزة في واتساب. أرسلها وسيرد فريقنا قريباً.',
    footer_desc: 'مطابخ ودريسينج روم وأثاث مخصص، تُصمم وتُنفذ في القاهرة الجديدة بخامات معتمدة وتركيب احترافي وضمان خمس سنوات.',
    footer_badge_1: 'ضمان 5 سنوات',
    footer_badge_2: 'توصيل ثابت 5,000 جنيه',
    footer_badge_3: 'إنستاباي والمحفظة',
    footer_explore: 'استكشف',
    footer_visit: 'زيارة وتواصل',
    footer_faq: 'الأسئلة الشائعة',
    footer_showroom_page: 'المعرض والاتجاهات',
    footer_hours: 'يومياً: 11:00 صباحاً – 10:00 مساءً<br>التجمع الخامس، القاهرة الجديدة',
    footer_copyright_prefix: 'نالام للمطابخ والدريسينج روم.',
    footer_copyright_suffix: 'جميع الحقوق محفوظة.',
    footer_shop: 'تسوق المجموعة',
    footer_back_top: 'إلى الأعلى ↑',
    cart_eyebrow: 'اختيارك',
    cart_title: 'سلة التسوق',
    cart_items_heading: 'قطعك',
    cart_empty_title: 'سلتك ما زالت فارغة.',
    cart_empty_desc: 'استكشف المجموعة وأضف قطعة للبدء. يبقى التوصيل ثابتاً بـ 5,000 جنيه متى كنت جاهزاً.',
    cart_empty_cta: 'استكشف الكاتالوج',
    checkout_step_details: 'بيانات التوصيل',
    checkout_required: 'كل الحقول مطلوبة',
    checkout_name: 'اسم العميل',
    checkout_phone: 'رقم الهاتف',
    checkout_gov: 'المحافظة',
    checkout_floor: 'رقم الدور <span>(للتنظيم اللوجستي)</span>',
    checkout_account_required: 'الحساب مطلوب لتأكيد طلبك. سلتك محفوظة وتُستأنف بعد تسجيل الدخول.',
    checkout_step_payment: 'طريقة الدفع',
    checkout_no_card: 'لا تُجمع بيانات البطاقات',
    payment_instapay_sub: 'تحويل إلى حساب إنستاباي',
    payment_wallet: 'المحفظة الإلكترونية',
    payment_wallet_sub: 'إرسال إلى رقم محفظتنا',
    payment_details_label: 'بيانات الدفع',
    copy: 'نسخ',
    payment_instapay_note: 'أرسل الإجمالي ثم شارك الإيصال على واتساب. نؤكد موعد التصنيع في نفس اليوم.',
    summary_items: 'القطع',
    summary_delivery: 'التوصيل',
    summary_total: 'الإجمالي',
    checkout_confirm: 'تأكيد الطلب والإرسال عبر واتساب',
    checkout_secure: 'ملخص آمن · يؤكد فريقنا الدفع على واتساب',
    wishlist_eyebrow: 'محفوظة لوقت لاحق',
    wishlist_title: 'المفضلة',
    wishlist_empty_title: 'لا يوجد محفوظ بعد.',
    wishlist_empty_desc: 'اضغط القلب على أي قطعة لتبقى هنا أثناء التفكير.',
    wishlist_empty_cta: 'تصفح المجموعة',
    wishlist_note: 'تبقى القطع المحفوظة على هذا الجهاز. أضف أي قطعة إلى سلتك متى أردت.',
    wishlist_cta: 'متابعة التصفح',
    modal_price_label: 'السعر شامل التركيب',
    modal_add_cart: 'أضف إلى السلة',
    modal_spec_dimensions: 'المقاسات',
    modal_spec_material: 'الخامة',
    modal_spec_hardware: 'الإكسسوارات',
    modal_spec_finish: 'التشطيب',
    modal_spec_code: 'الكود',
    modal_delivery: 'توصيل ثابت 5,000 جنيه وتركيب احترافي في القاهرة والجيزة، أياً كان حجم الطلب.',
    modal_support: 'تحتاج مقاساً أو تشطيباً مخصصاً؟',
    modal_support_link: 'اسأل مصمماً على واتساب',
    auth_visual_title: 'منزلك، بكل تفاصيله.',
    auth_visual_desc: 'حساب واحد لطلباتك وبيانات التوصيل وسجل الضمان — محفوظ بهدوء على هذا الجهاز.',
    auth_benefit_1: 'استأنف سلتك تماماً كما تركتها',
    auth_benefit_2: 'احتفظ ببيانات التوصيل والدور جاهزة',
    auth_benefit_3: 'اطلع على تاريخ طلباتك وسجل الضمان',
    auth_title: 'أهلاً بعودتك.',
    auth_subtitle: 'سجل الدخول لتأكيد طلبك وحفظ تفاصيلك في مكان واحد.',
    auth_tab_signin: 'تسجيل الدخول',
    auth_tab_signup: 'إنشاء حساب',
    auth_email: 'البريد الإلكتروني',
    auth_password: 'كلمة المرور',
    auth_signin_cta: 'تسجيل الدخول والمتابعة',
    auth_footnote: 'يحفظ هذا الموقع الحسابات محلياً على جهازك. تُشفّر كلمة المرور قبل الحفظ؛ لا تعِد استخدام كلمة مرور حساسة.',
    auth_support: 'تحتاج مساعدة في حسابك؟',
    auth_name: 'الاسم الكامل',
    auth_phone: 'رقم الهاتف',
    auth_gov: 'المحافظة',
    auth_confirm: 'تأكيد كلمة المرور',
    auth_signup_cta: 'إنشاء الحساب',
    auth_signup_note: 'بإنشاء حساب توافق على التواصل معك بخصوص طلباتك واستشاراتك. لا تُحفظ بيانات البطاقات.',
    profile_stat_orders: 'الطلبات',
    profile_stat_wishlist: 'المفضلة',
    profile_stat_cart: 'في السلة',
    profile_recent_orders: 'أحدث الطلبات',
    profile_view_cart: 'عرض السلة',
    profile_view_wishlist: 'المفضلة',
    profile_signout: 'تسجيل الخروج',
    account_signin: 'تسجيل الدخول'
  };

  var MESSAGES = {
    en: {
      signin_label: 'Sign In',
      items: '{{n}} items',
      item_one: '{{n}} item',
      added: '{{name}} added to your cart.',
      removed: 'Removed from your cart.',
      wish_added: '{{name}} saved to your wishlist.',
      wish_removed: '{{name}} removed from your wishlist.',
      max_qty: 'You can add up to {{n}} of this piece per order.',
      copied: 'Copied to clipboard.',
      copy_failed: 'Could not copy — please select the text manually.',
      auth_required: 'Sign in to confirm your order. Your cart is saved.',
      auth_banner: 'Sign in or create an account to confirm your order. Your cart and delivery details are waiting.',
      resume_success: 'Signed in — your cart is ready. Confirm your order below.',
      welcome: 'Welcome back, {{name}}.',
      account_created: 'Your account is ready. Welcome to Nalam, {{name}}.',
      signed_out: 'You have been signed out.',
      order_sent: 'Your order summary is open in WhatsApp. Send the message and we will confirm your slot.',
      order_saved: 'Order {{id}} saved to your account.',
      empty_cart: 'Your cart is empty. Add a piece to continue.',
      empty_wishlist: 'Your wishlist is empty.',
      signed_in_as: 'Signed in as {{name}} — your details are prefilled.',
      guest_note: 'An account is required to confirm your order. Your cart is saved and resumes after sign-in.',
      contact_ready: 'Your message is ready in WhatsApp. Send it and our team will reply shortly.',
      cart_meta: '{{count}} · Cairo & Giza delivery',
      wish_meta: '{{count}} saved',
      order_note: 'Flat-rate 5,000 EGP delivery & professional installation across anywhere in Cairo & Giza (up to 2nd floor) applies to any order size, whether single pieces or full rooms.',
      wallet_note: 'Send the total to our mobile wallet, then share the receipt on WhatsApp.',
      err_required: 'This field is required.',
      err_name: 'Please enter your full name (at least 2 characters).',
      err_phone: 'Enter a valid Egyptian mobile number, for example 011 3228 4750.',
      err_email: 'Enter a valid email address.',
      err_password: 'Use at least 8 characters with letters and numbers.',
      err_confirm: 'The passwords do not match.',
      err_payment: 'Choose InstaPay or Mobile Wallet.',
      err_floor: 'Select the floor for installation logistics.',
      err_exists: 'An account already exists with this email. Please sign in.',
      err_credentials: 'Email or password is incorrect.',
      err_secure: 'Account security is unavailable in this browser context. Open the site over HTTPS.',
      no_orders: 'No orders yet — your first piece is waiting.',
      order_status: 'Sent via WhatsApp',
      cart_short: 'Cart',
      wish_short: 'Saved',
      close: 'Close',
      wa_order_title: 'NEW NALAM ORDER',
      wa_order_title_ar: 'طلب جديد من نالام',
      wa_order_ref: 'Order reference',
      wa_customer: 'Customer',
      wa_phone: 'Phone',
      wa_governorate: 'Governorate',
      wa_floor: 'Floor',
      wa_payment: 'Payment method',
      wa_items: 'ITEMS',
      wa_items_ar: 'القطع',
      wa_qty: 'Qty',
      wa_dimensions: 'Dimensions',
      wa_subtotal: 'Items subtotal',
      wa_delivery: 'Delivery & installation',
      wa_total: 'TOTAL',
      wa_delivery_note: 'Flat 5,000 EGP delivery & professional installation across Cairo & Giza (up to 2nd floor), any order size.',
      wa_delivery_note_ar: 'توصيل وتركيب احترافي بسعر ثابت 5,000 جنيه مصري في القاهرة والجيزة (حتى الدور الثاني)، لأي حجم طلب.',
      wa_thanks: 'Thank you — the Nalam team will confirm your production slot on this chat.',
      wa_thanks_ar: 'شكراً — سيؤكد فريق نالام موعد التصنيع على هذه المحادثة.',
      wa_contact_title: 'NEW NALAM CONSULTATION',
      wa_contact_title_ar: 'استشارة جديدة من نالام',
      wa_interest: 'Interested in',
      wa_message: 'Message',
      wa_contact_thanks: 'Please send this message so our designers can reply.',
      wa_contact_thanks_ar: 'يرجى إرسال هذه الرسالة ليرد مصممونا.',
      auth_title_signin: 'Welcome back.',
      auth_subtitle_signin: 'Sign in to confirm your order and keep your details in one place.',
      auth_title_signup: 'Create your Nalam account.',
      auth_subtitle_signup: 'One account for orders, delivery details and your warranty record.',
      auth_tab_signin: 'Sign In',
      auth_tab_signup: 'Create Account',
      auth_busy: 'Please wait…',
      date_locale: 'en-GB',
      footer_year: '2026'
    },
    ar: {
      signin_label: 'تسجيل الدخول',
      items: '{{n}} قطعة',
      item_one: 'قطعة واحدة',
      added: 'تمت إضافة {{name}} إلى سلتك.',
      removed: 'تمت الإزالة من سلتك.',
      wish_added: 'تم حفظ {{name}} في المفضلة.',
      wish_removed: 'تمت إزالة {{name}} من المفضلة.',
      max_qty: 'يمكنك إضافة {{n}} قطعة كحد أقصى من هذا المنتج في الطلب.',
      copied: 'تم النسخ.',
      copy_failed: 'تعذر النسخ — حدد النص يدوياً.',
      auth_required: 'سجل الدخول لتأكيد طلبك. سلتك محفوظة.',
      auth_banner: 'سجل الدخول أو أنشئ حساباً لتأكيد طلبك. سلتك وبيانات التوصيل في انتظارك.',
      resume_success: 'تم تسجيل الدخول — سلتك جاهزة. أكّد طلبك بالأسفل.',
      welcome: 'أهلاً بعودتك، {{name}}.',
      account_created: 'حسابك جاهز. أهلاً بك في نالام، {{name}}.',
      signed_out: 'تم تسجيل الخروج.',
      order_sent: 'ملخص طلبك مفتوح في واتساب. أرسل الرسالة وسنؤكد موعدك.',
      order_saved: 'تم حفظ الطلب {{id}} في حسابك.',
      empty_cart: 'سلتك فارغة. أضف قطعة للمتابعة.',
      empty_wishlist: 'قائمة المفضلة فارغة.',
      signed_in_as: 'مسجل الدخول باسم {{name}} — بياناتك معبأة مسبقاً.',
      guest_note: 'الحساب مطلوب لتأكيد طلبك. سلتك محفوظة وتُستأنف بعد تسجيل الدخول.',
      cart_meta: '{{count}} · توصيل القاهرة والجيزة',
      wish_meta: '{{count}} محفوظة',
      order_note: 'التوصيل والتركيب الاحترافي بسعر ثابت 5,000 جنيه مصري في أي مكان بالقاهرة والجيزة (حتى الدور الثاني) ينطبق على أي حجم طلب، سواء قطعة واحدة أو غرف كاملة.',
      wallet_note: 'أرسل الإجمالي إلى محفظتنا الإلكترونية ثم شارك الإيصال على واتساب.',
      err_required: 'هذا الحقل مطلوب.',
      err_name: 'أدخل اسمك الكامل (حرفان على الأقل).',
      err_phone: 'أدخل رقم موبايل مصري صحيح، مثل 011 3228 4750.',
      err_email: 'أدخل بريداً إلكترونياً صحيحاً.',
      err_password: 'استخدم 8 أحرف على الأقل مع حروف وأرقام.',
      err_confirm: 'كلمتا المرور غير متطابقتين.',
      err_payment: 'اختر إنستاباي أو المحفظة الإلكترونية.',
      err_floor: 'اختر الدور لأغراض التركيب.',
      err_exists: 'يوجد حساب بهذا البريد بالفعل. سجل الدخول.',
      err_credentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.',
      err_secure: 'أمان الحساب غير متاح في هذه البيئة. افتح الموقع عبر HTTPS.',
      no_orders: 'لا توجد طلبات بعد — قطعتك الأولى في انتظارك.',
      order_status: 'أُرسل عبر واتساب',
      cart_short: 'السلة',
      wish_short: 'المحفوظات',
      close: 'إغلاق',
      wa_order_title: 'NEW NALAM ORDER',
      wa_order_title_ar: 'طلب جديد من نالام',
      wa_order_ref: 'رقم الطلب',
      wa_customer: 'العميل',
      wa_phone: 'الهاتف',
      wa_governorate: 'المحافظة',
      wa_floor: 'الدور',
      wa_payment: 'طريقة الدفع',
      wa_items: 'ITEMS',
      wa_items_ar: 'القطع',
      wa_qty: 'الكمية',
      wa_dimensions: 'المقاسات',
      wa_subtotal: 'إجمالي القطع',
      wa_delivery: 'التوصيل والتركيب',
      wa_total: 'الإجمالي',
      wa_delivery_note: 'Flat 5,000 EGP delivery & professional installation across Cairo & Giza (up to 2nd floor), any order size.',
      wa_delivery_note_ar: 'توصيل وتركيب احترافي بسعر ثابت 5,000 جنيه مصري في القاهرة والجيزة (حتى الدور الثاني)، لأي حجم طلب.',
      wa_thanks: 'Thank you — the Nalam team will confirm your production slot on this chat.',
      wa_thanks_ar: 'شكراً — سيؤكد فريق نالام موعد التصنيع على هذه المحادثة.',
      wa_contact_title: 'NEW NALAM CONSULTATION',
      wa_contact_title_ar: 'استشارة جديدة من نالام',
      wa_interest: 'المهتم به',
      wa_message: 'الرسالة',
      wa_contact_thanks: 'Please send this message so our designers can reply.',
      wa_contact_thanks_ar: 'يرجى إرسال هذه الرسالة ليرد مصممونا.',
      auth_title_signin: 'أهلاً بعودتك.',
      auth_subtitle_signin: 'سجل الدخول لتأكيد طلبك وحفظ تفاصيلك في مكان واحد.',
      auth_title_signup: 'أنشئ حساب نالام.',
      auth_subtitle_signup: 'حساب واحد للطلبات وبيانات التوصيل وسجل الضمان.',
      auth_tab_signin: 'تسجيل الدخول',
      auth_tab_signup: 'إنشاء حساب',
      auth_busy: 'لحظة من فضلك…',
      date_locale: 'ar-EG',
      footer_year: '2026'
    }
  };

  var PLACEHOLDERS = {
    en: {
      contactName: 'Your full name',
      contactPhone: '01X XXXX XXXX',
      contactMessage: 'Room size, preferred finish, timeline…',
      checkoutName: 'Full name',
      checkoutPhone: '01X XXXX XXXX',
      signInEmail: 'you@example.com',
      signInPassword: 'Your password',
      signUpName: 'Your full name',
      signUpPhone: '01X XXXX XXXX',
      signUpEmail: 'you@example.com',
      signUpPassword: 'At least 8 characters',
      signUpConfirm: 'Repeat password'
    },
    ar: {
      contactName: 'اسمك الكامل',
      contactPhone: '01X XXXX XXXX',
      contactMessage: 'مساحة الغرفة، التشطيب المفضل، التوقيت…',
      checkoutName: 'الاسم الكامل',
      checkoutPhone: '01X XXXX XXXX',
      signInEmail: 'you@example.com',
      signInPassword: 'كلمة المرور',
      signUpName: 'اسمك الكامل',
      signUpPhone: '01X XXXX XXXX',
      signUpEmail: 'you@example.com',
      signUpPassword: '8 أحرف على الأقل',
      signUpConfirm: 'أعد كلمة المرور'
    }
  };

  function t(key, vars) {
    var table = MESSAGES[state.lang] || MESSAGES.en;
    var text = table[key] != null ? table[key] : (MESSAGES.en[key] != null ? MESSAGES.en[key] : key);
    return String(text).replace(/\{\{(\w+)\}\}/g, function (_, token) {
      return vars && vars[token] != null ? String(vars[token]) : '';
    });
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function money(amount) {
    var value = Number(amount) || 0;
    return value.toLocaleString('en-US') + ' EGP';
  }

  function formatDate(value) {
    var date = value ? new Date(value) : new Date();
    try {
      return date.toLocaleDateString(t('date_locale'), { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (error) {
      return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }

  function categoryName(id) {
    var category = CATEGORY_MAP.get(id);
    if (!category) return id;
    return state.lang === 'ar' ? category.ar : category.en;
  }

  function productTitle(product) {
    return state.lang === 'ar' ? product.titleAr : product.titleEn;
  }

  function productMaterial(product) {
    return state.lang === 'ar' ? product.materialAr : product.materialEn;
  }

  function productHardware(product) {
    return state.lang === 'ar' ? product.hardwareAr : product.hardwareEn;
  }

  function productFinish(product) {
    return state.lang === 'ar' ? product.finishAr : product.finishEn;
  }

  function productImageLabel(product, index) {
    var image = product.images[index];
    if (!image) return state.lang === 'ar' ? 'صورة المنتج' : 'Product view';
    return state.lang === 'ar' ? image.labelAr : image.labelEn;
  }

  function itemCountText(count) {
    if (state.lang === 'ar') return count === 1 ? 'قطعة واحدة' : count + ' قطعة';
    return count === 1 ? '1 item' : count + ' items';
  }

  function readJSON(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      var parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      /* Storage can be unavailable in private browsing; the session still works in memory. */
    }
  }

  function readText(key, fallback) {
    try {
      return window.localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeText(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* Ignore unavailable storage. */
    }
  }

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function normalizeCart(raw) {
    if (!Array.isArray(raw)) return [];
    var seen = new Map();
    raw.forEach(function (entry) {
      if (!entry || !PRODUCT_MAP.has(entry.id)) return;
      var qty = Math.max(1, Math.min(MAX_QTY, parseInt(entry.qty, 10) || 1));
      seen.set(entry.id, Math.min(MAX_QTY, (seen.get(entry.id) || 0) + qty));
    });
    return Array.from(seen, function (pair) { return { id: pair[0], qty: pair[1] }; });
  }

  function normalizeWishlist(raw) {
    if (!Array.isArray(raw)) return [];
    return Array.from(new Set(raw.filter(function (id) { return PRODUCT_MAP.has(id); })));
  }

  function saveCart() {
    writeJSON(STORE_KEYS.cart, state.cart);
  }

  function saveWishlist() {
    writeJSON(STORE_KEYS.wishlist, state.wishlist);
  }

  function saveAccounts() {
    writeJSON(STORE_KEYS.accounts, state.accounts);
  }

  function currentAccount() {
    if (!state.sessionId) return null;
    return state.accounts.find(function (account) { return account.id === state.sessionId; }) || null;
  }

  function cartDetails() {
    return state.cart.map(function (entry) {
      var product = PRODUCT_MAP.get(entry.id);
      return {
        product: product,
        qty: entry.qty,
        lineTotal: product.priceEgp * entry.qty
      };
    }).filter(function (entry) { return !!entry.product; });
  }

  function cartQuantity() {
    return state.cart.reduce(function (total, entry) { return total + entry.qty; }, 0);
  }

  function cartSubtotal() {
    return cartDetails().reduce(function (total, entry) { return total + entry.lineTotal; }, 0);
  }

  function deliveryFee() {
    return state.cart.length ? Number(CFG.baseDeliveryFeeEgp) || 5000 : 0;
  }

  function cartTotal() {
    return cartSubtotal() + deliveryFee();
  }

  function saveLanguage() {
    writeText(STORE_KEYS.lang, state.lang);
  }

  /* ------------------------------------------------------------------------
     Branded product artwork and progressive photo loading
     ------------------------------------------------------------------------ */

  var PALETTES = {
    bed: ['#EFE4D2', '#C7AA80', '#3B3126'],
    dressing: ['#E6DAC7', '#B59A75', '#372D23'],
    kitchens: ['#E1E7DD', '#9AAE9D', '#263129'],
    vanity: ['#F2E7D6', '#D2B48B', '#3D3126'],
    nightstand: ['#ECE1CF', '#C0A47C', '#3A2F25'],
    bedrooms: ['#E8DDCE', '#BFA683', '#362D24'],
    'coffee-corner': ['#E4D8C9', '#A98D6D', '#33291F'],
    'shoe-cabinets': ['#E9DECE', '#B99E7B', '#392F25'],
    'wc-units': ['#E7E6DE', '#B3B2A1', '#30322B']
  };

  var FALLBACK_CACHE = new Map();

  function fallbackArt(product, index) {
    var key = product.id + ':' + index;
    if (FALLBACK_CACHE.has(key)) return FALLBACK_CACHE.get(key);
    var palette = PALETTES[product.category] || ['#EFE5D5', '#C4AA86', '#3A3026'];
    var category = CATEGORY_MAP.get(product.category);
    var categoryLabel = category ? category.en.toUpperCase() : 'NALAM';
    var angle = product.images[index] ? product.images[index].labelEn : 'Atelier view';
    var shift = (index % 4) * 34;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img">' +
      '<defs>' +
      '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + palette[0] + '"/>' +
      '<stop offset="0.62" stop-color="' + palette[1] + '"/>' +
      '<stop offset="1" stop-color="' + palette[2] + '"/>' +
      '</linearGradient>' +
      '<radialGradient id="glow" cx="50%" cy="50%" r="50%">' +
      '<stop offset="0" stop-color="#FFF6E4" stop-opacity="0.82"/>' +
      '<stop offset="1" stop-color="#FFF6E4" stop-opacity="0"/>' +
      '</radialGradient>' +
      '</defs>' +
      '<rect width="1200" height="900" fill="url(#bg)"/>' +
      '<circle cx="' + (920 - shift) + '" cy="' + (190 + shift) + '" r="330" fill="url(#glow)"/>' +
      '<g opacity="0.24" fill="none" stroke="#FFF9EE" stroke-width="3">' +
      '<rect x="180" y="250" width="840" height="470" rx="18"/>' +
      '<path d="M 330 720 V 360 A 130 130 0 0 1 590 360 V 720"/>' +
      '<path d="M 660 720 V 360 A 130 130 0 0 1 920 360 V 720"/>' +
      '<path d="M 180 470 H 1020"/>' +
      '<path d="M 180 590 H 1020"/>' +
      '<circle cx="985" cy="740" r="46"/>' +
      '</g>' +
      '<g fill="#FFFDF7" font-family="Georgia, Times New Roman, serif">' +
      '<text x="88" y="126" font-size="42" letter-spacing="10">NALAM</text>' +
      '<text x="90" y="166" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="6" opacity="0.7">ATELIER COLLECTION</text>' +
      '<text x="90" y="735" font-size="31" letter-spacing="2">' + esc(categoryLabel) + '</text>' +
      '<text x="90" y="782" font-family="Arial, Helvetica, sans-serif" font-size="17" letter-spacing="3" opacity="0.72">' + esc(product.code) + '</text>' +
      '</g>' +
      '<g>' +
      '<rect x="88" y="812" width="' + (130 + angle.length * 9) + '" height="40" rx="20" fill="#FFF9EE" fill-opacity="0.16" stroke="#FFF9EE" stroke-opacity="0.35"/>' +
      '<text x="108" y="838" fill="#FFFDF7" font-family="Arial, Helvetica, sans-serif" font-size="14" letter-spacing="2">' + esc(angle.toUpperCase()) + '</text>' +
      '</g>' +
      '<text x="1112" y="846" text-anchor="end" fill="#FFFDF7" fill-opacity="0.58" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="3">MADE TO ORDER</text>' +
      '</svg>';
    var uri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    FALLBACK_CACHE.set(key, uri);
    return uri;
  }

  var PHOTO_WAITERS = new Map();
  var photoObserver = null;

  function applyProductPhoto(img, product, index) {
    if (!img || !product) return;
    var image = product.images[index] || product.images[0];
    var fallback = fallbackArt(product, index);
    if (!image || !image.src) {
      img.src = fallback;
      return;
    }
    var real = image.src;
    var status = PHOTO_CACHE.get(real);
    if (status === 'ok') {
      img.src = real;
      return;
    }
    if (status === 'fail') {
      img.src = fallback;
      return;
    }
    img.src = fallback;
    if (status === 'loading') {
      var waiting = PHOTO_WAITERS.get(real) || [];
      waiting.push(img);
      PHOTO_WAITERS.set(real, waiting);
      return;
    }
    PHOTO_CACHE.set(real, 'loading');
    var probe = new Image();
    probe.decoding = 'async';
    probe.onload = function () {
      PHOTO_CACHE.set(real, 'ok');
      var targets = PHOTO_WAITERS.get(real) || [];
      targets.push(img);
      PHOTO_WAITERS.delete(real);
      targets.forEach(function (target) {
        if (target && target.isConnected) target.src = real;
      });
    };
    probe.onerror = function () {
      PHOTO_CACHE.set(real, 'fail');
      PHOTO_WAITERS.delete(real);
    };
    probe.src = real;
  }

  function observeProductPhoto(img, product, index) {
    img.dataset.photoProduct = product.id;
    img.dataset.photoIndex = String(index);
    img.src = fallbackArt(product, index);
    if (!('IntersectionObserver' in window)) {
      applyProductPhoto(img, product, index);
      return;
    }
    if (!photoObserver) {
      photoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var target = entry.target;
          var productRecord = PRODUCT_MAP.get(target.dataset.photoProduct);
          if (productRecord) {
            applyProductPhoto(target, productRecord, parseInt(target.dataset.photoIndex, 10) || 0);
          }
          photoObserver.unobserve(target);
        });
      }, { rootMargin: '320px 0px', threshold: 0.01 });
    }
    photoObserver.observe(img);
  }

  /* ------------------------------------------------------------------------
     Catalogue
     ------------------------------------------------------------------------ */

  function trackPixel(eventName, params) {
    if (!window.NALAM_PIXEL_READY || typeof window.fbq !== 'function') return;
    try {
      window.fbq('track', eventName, params || {});
    } catch (error) {
      /* Analytics must never interrupt a purchase flow. */
    }
  }

  function renderFilters() {
    if (!refs.filterBar) return;
    var total = PRODUCTS.length;
    var html = '<button type="button" class="filter-tab' + (state.activeCategory === 'all' ? ' active' : '') + '" role="tab" aria-selected="' + (state.activeCategory === 'all') + '" data-filter="all">' +
      esc(state.lang === 'ar' ? 'الكل' : 'All') + ' <span class="filter-count">' + total + '</span></button>';
    CATEGORIES.forEach(function (category) {
      if (category.id === 'all') return;
      var count = PRODUCTS.filter(function (product) { return product.category === category.id; }).length;
      if (!count) return;
      var active = state.activeCategory === category.id;
      html += '<button type="button" class="filter-tab' + (active ? ' active' : '') + '" role="tab" aria-selected="' + active + '" data-filter="' + esc(category.id) + '">' +
        esc(state.lang === 'ar' ? category.ar : category.en) + ' <span class="filter-count">' + count + '</span></button>';
    });
    refs.filterBar.innerHTML = html;
  }

  function productCardHTML(product) {
    var saved = state.wishlist.indexOf(product.id) !== -1;
    return '<article class="product-card" data-product-card="' + esc(product.id) + '">' +
      '<div class="product-media" data-open-product="' + esc(product.id) + '" role="button" tabindex="0" aria-label="' + esc(productTitle(product)) + '">' +
      '<img class="product-img" data-photo-product="' + esc(product.id) + '" data-photo-index="0" alt="' + esc(productTitle(product)) + ' — ' + esc(productImageLabel(product, 0)) + '" width="1200" height="900" loading="lazy" decoding="async">' +
      '<div class="product-badges">' +
      '<span class="product-cat-badge">' + esc(categoryName(product.category)) + '</span>' +
      '<span class="product-code-badge">' + esc(product.code) + '</span>' +
      '</div>' +
      '<button type="button" class="product-wish' + (saved ? ' saved' : '') + '" data-wishlist-toggle="' + esc(product.id) + '" aria-pressed="' + saved + '" aria-label="' + esc(state.lang === 'ar' ? 'حفظ في المفضلة' : 'Save to wishlist') + '">' + (saved ? '♥' : '♡') + '</button>' +
      '<span class="product-angles">' + product.images.length + ' ' + esc(state.lang === 'ar' ? 'زوايا' : 'views') + '</span>' +
      '</div>' +
      '<div class="product-body">' +
      '<div class="product-category-line"><span>' + esc(categoryName(product.category)) + '</span><span>' + esc(product.code) + '</span></div>' +
      '<h3 class="product-title" data-open-product="' + esc(product.id) + '">' + esc(productTitle(product)) + '</h3>' +
      '<p class="product-dims">' + esc(product.dimensions) + '</p>' +
      '<p class="product-spec">' + esc(productMaterial(product)) + '</p>' +
      '<div class="product-footer">' +
      '<div><span class="product-price-label">' + esc(state.lang === 'ar' ? 'السعر شامل التركيب' : 'Price incl. installation') + '</span><span class="product-price-val">' + money(product.priceEgp) + '</span></div>' +
      '</div>' +
      '<div class="product-actions">' +
      '<button type="button" class="btn btn-primary" data-add-to-cart="' + esc(product.id) + '">' + esc(state.lang === 'ar' ? 'أضف إلى السلة' : 'Add to cart') + '</button>' +
      '<button type="button" class="btn btn-outline btn-wish" data-wishlist-toggle="' + esc(product.id) + '" aria-label="' + esc(state.lang === 'ar' ? 'حفظ في المفضلة' : 'Save to wishlist') + '" aria-pressed="' + saved + '">' + (saved ? '♥' : '♡') + '</button>' +
      '</div>' +
      '</div>' +
      '</article>';
  }

  function renderCatalogue() {
    if (!refs.catalogueGrid) return;
    var filtered = state.activeCategory === 'all' ? PRODUCTS : PRODUCTS.filter(function (product) {
      return product.category === state.activeCategory;
    });
    refs.catalogueGrid.innerHTML = filtered.map(productCardHTML).join('');
    $$('.product-img', refs.catalogueGrid).forEach(function (img) {
      var product = PRODUCT_MAP.get(img.dataset.photoProduct);
      if (product) observeProductPhoto(img, product, 0);
    });
    $$('[data-catalogue-count]').forEach(function (node) {
      node.textContent = String(filtered.length);
    });
    renderFilters();
  }

  function setFilter(categoryId) {
    if (categoryId !== 'all' && !CATEGORY_MAP.has(categoryId)) return;
    state.activeCategory = categoryId;
    renderCatalogue();
  }

  /* ------------------------------------------------------------------------
     Badges, cart and wishlist
     ------------------------------------------------------------------------ */

  function updateBadges(bumpCart, bumpWishlist) {
    var cartCount = cartQuantity();
    var wishCount = state.wishlist.length;
    $$('[data-cart-badge]').forEach(function (badge) {
      badge.textContent = String(cartCount);
      badge.classList.toggle('has-items', cartCount > 0);
      if (bumpCart) {
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
      }
    });
    $$('[data-wish-badge]').forEach(function (badge) {
      badge.textContent = String(wishCount);
      badge.classList.toggle('has-items', wishCount > 0);
      if (bumpWishlist) {
        badge.classList.remove('bump');
        void badge.offsetWidth;
        badge.classList.add('bump');
      }
    });
  }

  function syncWishButtons() {
    $$('[data-wishlist-toggle]').forEach(function (button) {
      var id = button.dataset.wishlistToggle;
      var saved = state.wishlist.indexOf(id) !== -1;
      button.classList.toggle('saved', saved);
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
      button.textContent = saved ? '♥' : '♡';
    });
    if (state.currentProductId) {
      var product = PRODUCT_MAP.get(state.currentProductId);
      var wishButton = refs.modalWishlist;
      if (product && wishButton) {
        var inWishlist = state.wishlist.indexOf(product.id) !== -1;
        wishButton.classList.toggle('saved', inWishlist);
        wishButton.setAttribute('aria-pressed', inWishlist ? 'true' : 'false');
        wishButton.textContent = inWishlist ? '♥' : '♡';
      }
    }
  }

  function updateAccountLabel() {
    var account = currentAccount();
    var label = account ? account.name.trim().split(/\s+/)[0] : t('signin_label');
    $$('[data-account-label]').forEach(function (node) {
      node.textContent = label;
    });
  }

  function addToCart(productId, qty, options) {
    var product = PRODUCT_MAP.get(productId);
    if (!product) return;
    var amount = Math.max(1, parseInt(qty, 10) || 1);
    var existing = state.cart.find(function (entry) { return entry.id === productId; });
    if (existing) {
      if (existing.qty >= MAX_QTY) {
        showToast(t('max_qty', { n: MAX_QTY }));
        return;
      }
      existing.qty = Math.min(MAX_QTY, existing.qty + amount);
    } else {
      state.cart.push({ id: productId, qty: Math.min(MAX_QTY, amount) });
    }
    saveCart();
    renderCart();
    updateBadges(true, false);
    trackPixel('AddToCart', {
      content_ids: [product.id],
      content_name: product.titleEn,
      content_type: 'product',
      value: product.priceEgp * amount,
      currency: 'EGP',
      num_items: amount
    });
    showToast(t('added', { name: productTitle(product) }));
    if (!options || options.open !== false) openCart();
  }

  function setCartQty(productId, qty) {
    var entry = state.cart.find(function (item) { return item.id === productId; });
    if (!entry) return;
    var amount = parseInt(qty, 10) || 0;
    if (amount <= 0) {
      removeCartItem(productId);
      return;
    }
    entry.qty = Math.min(MAX_QTY, Math.max(1, amount));
    saveCart();
    renderCart();
    updateBadges(false, false);
  }

  function removeCartItem(productId, silent) {
    var product = PRODUCT_MAP.get(productId);
    state.cart = state.cart.filter(function (entry) { return entry.id !== productId; });
    saveCart();
    renderCart();
    updateBadges(false, false);
    if (!silent) showToast(product ? t('removed') : t('removed'));
  }

  function toggleWishlist(productId, sourceButton) {
    var product = PRODUCT_MAP.get(productId);
    if (!product) return;
    var index = state.wishlist.indexOf(productId);
    var added = index === -1;
    if (added) state.wishlist.push(productId);
    else state.wishlist.splice(index, 1);
    saveWishlist();
    updateBadges(false, true);
    syncWishButtons();
    if (refs.wishlistDrawer && refs.wishlistDrawer.classList.contains('open')) renderWishlist();
    if (state.sessionId) renderProfile();
    if (sourceButton) {
      sourceButton.classList.remove('pop');
      void sourceButton.offsetWidth;
      sourceButton.classList.add('pop');
    }
    showToast(added ? t('wish_added', { name: productTitle(product) }) : t('wish_removed', { name: productTitle(product) }));
  }

  function cartItemHTML(entry) {
    var product = entry.product;
    return '<article class="drawer-item" data-cart-item="' + esc(product.id) + '">' +
      '<div class="drawer-item-img"><img alt="' + esc(productTitle(product)) + '" width="160" height="160" loading="lazy" decoding="async" data-cart-photo="' + esc(product.id) + '"></div>' +
      '<div class="drawer-item-main">' +
      '<div class="drawer-item-title">' + esc(productTitle(product)) + '</div>' +
      '<div class="drawer-item-meta">' + esc(product.code) + ' · ' + esc(product.dimensions) + '</div>' +
      '<div class="drawer-item-price">' + money(entry.lineTotal) + '</div>' +
      '<div class="drawer-item-controls">' +
      '<div class="qty-control">' +
      '<button type="button" class="qty-btn" data-cart-dec="' + esc(product.id) + '" aria-label="' + esc(state.lang === 'ar' ? 'تقليل الكمية' : 'Decrease quantity') + '">−</button>' +
      '<span class="qty-value">' + entry.qty + '</span>' +
      '<button type="button" class="qty-btn" data-cart-inc="' + esc(product.id) + '" aria-label="' + esc(state.lang === 'ar' ? 'زيادة الكمية' : 'Increase quantity') + '">+</button>' +
      '</div>' +
      '<button type="button" class="remove-link" data-cart-remove="' + esc(product.id) + '">' + esc(state.lang === 'ar' ? 'إزالة' : 'Remove') + '</button>' +
      '</div>' +
      '</div>' +
      '</article>';
  }

  function syncCheckoutAccountNote() {
    if (!refs.checkoutAccountNote) return;
    var account = currentAccount();
    refs.checkoutAccountNote.classList.toggle('is-guest', !account);
    refs.checkoutAccountNote.textContent = account
      ? t('signed_in_as', { name: account.name })
      : t('guest_note');
  }

  function renderCart() {
    var details = cartDetails();
    var empty = details.length === 0;
    var subtotal = cartSubtotal();
    var delivery = deliveryFee();
    var total = cartTotal();

    if (refs.cartHeadMeta) refs.cartHeadMeta.textContent = t('cart_meta', { count: itemCountText(cartQuantity()) });
    if (refs.cartItemsCount) refs.cartItemsCount.textContent = itemCountText(cartQuantity());
    if (refs.cartItems) {
      refs.cartItems.innerHTML = details.map(cartItemHTML).join('');
      $$('[data-cart-photo]', refs.cartItems).forEach(function (img) {
        var product = PRODUCT_MAP.get(img.dataset.cartPhoto);
        if (product) applyProductPhoto(img, product, 0);
      });
    }
    if (refs.cartItemsSection) refs.cartItemsSection.hidden = empty;
    if (refs.cartEmptyState) refs.cartEmptyState.hidden = !empty;
    if (refs.checkoutForm) refs.checkoutForm.hidden = empty;
    if (refs.cartFooter) refs.cartFooter.classList.toggle('is-empty', empty);
    if (refs.flatRateBadge) refs.flatRateBadge.classList.toggle('show', !empty);
    if (refs.confirmOrderBtn) refs.confirmOrderBtn.hidden = empty;
    if (refs.summaryItems) refs.summaryItems.textContent = money(subtotal);
    if (refs.summaryDelivery) refs.summaryDelivery.textContent = money(delivery);
    if (refs.summaryTotal) refs.summaryTotal.textContent = money(total);
    if (refs.checkoutSuccess) {
      refs.checkoutSuccess.classList.remove('show');
      refs.checkoutSuccess.textContent = '';
    }
    syncCheckoutAccountNote();
    syncPaymentDetails();
    updateBadges(false, false);
  }

  function wishlistItemHTML(product) {
    return '<article class="drawer-item">' +
      '<div class="drawer-item-img"><img alt="' + esc(productTitle(product)) + '" width="160" height="160" loading="lazy" decoding="async" data-wish-photo="' + esc(product.id) + '"></div>' +
      '<div class="drawer-item-main">' +
      '<div class="drawer-item-title">' + esc(productTitle(product)) + '</div>' +
      '<div class="drawer-item-meta">' + esc(categoryName(product.category)) + ' · ' + esc(product.dimensions) + '</div>' +
      '<div class="drawer-item-price">' + money(product.priceEgp) + '</div>' +
      '<div class="drawer-item-controls">' +
      '<button type="button" class="btn btn-primary btn-sm" data-wishlist-add="' + esc(product.id) + '">' + esc(state.lang === 'ar' ? 'أضف إلى السلة' : 'Add to cart') + '</button>' +
      '<button type="button" class="remove-link" data-wishlist-remove="' + esc(product.id) + '">' + esc(state.lang === 'ar' ? 'إزالة' : 'Remove') + '</button>' +
      '</div>' +
      '</div>' +
      '</article>';
  }

  function renderWishlist() {
    if (!refs.wishlistItems) return;
    var products = state.wishlist.map(function (id) { return PRODUCT_MAP.get(id); }).filter(Boolean);
    if (refs.wishlistHeadMeta) refs.wishlistHeadMeta.textContent = t('wish_meta', { count: itemCountText(products.length) });
    refs.wishlistItems.innerHTML = products.map(wishlistItemHTML).join('');
    $$('[data-wish-photo]', refs.wishlistItems).forEach(function (img) {
      var product = PRODUCT_MAP.get(img.dataset.wishPhoto);
      if (product) observeProductPhoto(img, product, 0);
    });
    if (refs.wishlistEmptyState) refs.wishlistEmptyState.hidden = products.length > 0;
    syncWishButtons();
  }

  function paymentValue() {
    var selected = document.querySelector('input[name="paymentMethod"]:checked');
    return selected ? selected.value : '';
  }

  function syncPaymentDetails() {
    if (!refs.paymentDetailValue) return;
    var method = paymentValue();
    var handle = CFG.instapayHandle || 'nalam@instapay';
    var wallet = CFG.walletNumber || CFG.phoneDisplay || '+20 11 32284750';
    if (method === 'Mobile Wallet') {
      refs.paymentDetailValue.textContent = wallet;
      if (refs.paymentDetailNote) refs.paymentDetailNote.textContent = t('wallet_note');
    } else {
      refs.paymentDetailValue.textContent = handle;
      if (refs.paymentDetailNote) {
        refs.paymentDetailNote.textContent = state.lang === 'ar'
          ? 'أرسل الإجمالي ثم شارك الإيصال على واتساب. نؤكد موعد التصنيع في نفس اليوم.'
          : 'Send the total, then share the receipt on WhatsApp. We confirm your production slot the same day.';
      }
    }
  }

  function prefillCheckout() {
    var account = currentAccount();
    if (!account) return;
    if (refs.checkoutName && !refs.checkoutName.value) refs.checkoutName.value = account.name || '';
    if (refs.checkoutPhone && !refs.checkoutPhone.value) refs.checkoutPhone.value = account.phone || '';
    if (refs.checkoutGov && !refs.checkoutGov.value && account.governorate) {
      refs.checkoutGov.value = account.governorate;
    }
    if (refs.checkoutFloor && !refs.checkoutFloor.value && account.lastFloor != null) {
      refs.checkoutFloor.value = String(account.lastFloor);
    }
  }

  function showCheckoutSuccess(message) {
    if (!refs.checkoutSuccess) return;
    refs.checkoutSuccess.textContent = message;
    refs.checkoutSuccess.classList.add('show');
  }

  /* ------------------------------------------------------------------------
     Password hashing and account helpers
     ------------------------------------------------------------------------ */

  var SHA_K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  function rotateRight(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }

  function sha256Fallback(message) {
    var bytes = new TextEncoder().encode(message);
    var bitLength = bytes.length * 8;
    var total = (((bytes.length + 9 + 63) >> 6) << 6);
    var padded = new Uint8Array(total);
    padded.set(bytes);
    padded[bytes.length] = 0x80;
    var view = new DataView(padded.buffer);
    view.setUint32(total - 4, bitLength >>> 0, false);
    view.setUint32(total - 8, Math.floor(bitLength / 0x100000000), false);
    var hash = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var w = new Uint32Array(64);
    for (var offset = 0; offset < total; offset += 64) {
      var i;
      for (i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4, false);
      for (i = 16; i < 64; i += 1) {
        var s0 = rotateRight(w[i - 15], 7) ^ rotateRight(w[i - 15], 18) ^ (w[i - 15] >>> 3);
        var s1 = rotateRight(w[i - 2], 17) ^ rotateRight(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
      }
      var a = hash[0], b = hash[1], c = hash[2], d = hash[3];
      var e = hash[4], f = hash[5], g = hash[6], h = hash[7];
      for (i = 0; i < 64; i += 1) {
        var S1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
        var ch = (e & f) ^ (~e & g);
        var temp1 = (h + S1 + ch + SHA_K[i] + w[i]) >>> 0;
        var S0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
        var maj = (a & b) ^ (a & c) ^ (b & c);
        var temp2 = (S0 + maj) >>> 0;
        h = g;
        g = f;
        f = e;
        e = (d + temp1) >>> 0;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) >>> 0;
      }
      hash[0] = (hash[0] + a) >>> 0;
      hash[1] = (hash[1] + b) >>> 0;
      hash[2] = (hash[2] + c) >>> 0;
      hash[3] = (hash[3] + d) >>> 0;
      hash[4] = (hash[4] + e) >>> 0;
      hash[5] = (hash[5] + f) >>> 0;
      hash[6] = (hash[6] + g) >>> 0;
      hash[7] = (hash[7] + h) >>> 0;
    }
    return hash.map(function (word) { return word.toString(16).padStart(8, '0'); }).join('');
  }

  function sha256(text) {
    if (window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      return window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buffer) {
        return Array.prototype.map.call(new Uint8Array(buffer), function (byte) {
          return byte.toString(16).padStart(2, '0');
        }).join('');
      }).catch(function () {
        return sha256Fallback(text);
      });
    }
    return Promise.resolve(sha256Fallback(text));
  }

  function randomToken(length) {
    var alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var output = '';
    var values = null;
    if (window.crypto && window.crypto.getRandomValues) {
      values = new Uint8Array(length);
      window.crypto.getRandomValues(values);
    }
    for (var index = 0; index < length; index += 1) {
      var pick = values ? values[index] % alphabet.length : Math.floor(Math.random() * alphabet.length);
      output += alphabet.charAt(pick);
    }
    return output;
  }

  function createPasswordRecord(password) {
    var salt = randomToken(24);
    return sha256(salt + '::' + password).then(function (hash) {
      return { salt: salt, hash: hash };
    });
  }

  function verifyPassword(account, password) {
    return sha256((account.passwordSalt || '') + '::' + password).then(function (hash) {
      return hash === account.passwordHash;
    });
  }

  /* ------------------------------------------------------------------------
     Validation
     ------------------------------------------------------------------------ */

  function normalizePhone(value) {
    var digits = String(value || '').replace(/[^\d+]/g, '');
    if (digits.indexOf('+20') === 0) digits = '0' + digits.slice(3);
    else if (digits.indexOf('20') === 0 && digits.length === 12) digits = '0' + digits.slice(2);
    else if (digits.indexOf('0020') === 0) digits = '0' + digits.slice(4);
    return digits;
  }

  function isEgyptianPhone(value) {
    return /^01[0125]\d{8}$/.test(normalizePhone(value));
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
  }

  function isName(value) {
    return String(value || '').trim().length >= 2;
  }

  function isStrongPassword(value) {
    var text = String(value || '');
    return text.length >= 8 && /[A-Za-z]/.test(text) && /\d/.test(text);
  }

  function setFieldError(fieldId, message) {
    var errorNode = document.querySelector('[data-error-for="' + fieldId + '"]');
    if (errorNode) {
      errorNode.textContent = message;
      errorNode.classList.add('show');
    }
    var field = document.getElementById(fieldId);
    if (field) field.classList.add('invalid');
    if (fieldId === 'paymentMethod') {
      $$('.payment-card').forEach(function (card) { card.classList.add('invalid'); });
    }
  }

  function clearFieldError(fieldId) {
    var errorNode = document.querySelector('[data-error-for="' + fieldId + '"]');
    if (errorNode) {
      errorNode.textContent = '';
      errorNode.classList.remove('show');
    }
    var field = document.getElementById(fieldId);
    if (field) field.classList.remove('invalid');
    if (fieldId === 'paymentMethod') {
      $$('.payment-card').forEach(function (card) { card.classList.remove('invalid'); });
    }
  }

  function clearFormErrors(form) {
    if (!form) return;
    $$('.invalid', form).forEach(function (node) { node.classList.remove('invalid'); });
    $$('.field-error', form).forEach(function (node) {
      node.textContent = '';
      node.classList.remove('show');
    });
  }

  function focusField(fieldId) {
    var field = document.getElementById(fieldId);
    if (field && typeof field.focus === 'function') {
      field.focus({ preventScroll: true });
      field.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'center' });
    }
  }

  function validateAccountDetails(prefix) {
    var map = {
      name: prefix + 'Name',
      phone: prefix + 'Phone',
      email: prefix + 'Email',
      password: prefix + 'Password'
    };
    var valid = true;
    var nameField = document.getElementById(map.name);
    var phoneField = document.getElementById(map.phone);
    var emailField = document.getElementById(map.email);
    var passwordField = document.getElementById(map.password);
    if (nameField && !isName(nameField.value)) {
      setFieldError(map.name, t('err_name'));
      valid = false;
    }
    if (phoneField && !isEgyptianPhone(phoneField.value)) {
      setFieldError(map.phone, t('err_phone'));
      valid = false;
    }
    if (emailField && !isEmail(emailField.value)) {
      setFieldError(map.email, t('err_email'));
      valid = false;
    }
    if (passwordField && !isStrongPassword(passwordField.value)) {
      setFieldError(map.password, t('err_password'));
      valid = false;
    }
    return valid;
  }

  function validateCheckout() {
    var valid = true;
    var name = refs.checkoutName ? refs.checkoutName.value.trim() : '';
    var phone = refs.checkoutPhone ? refs.checkoutPhone.value : '';
    var gov = refs.checkoutGov ? refs.checkoutGov.value : '';
    var floor = refs.checkoutFloor ? refs.checkoutFloor.value : '';
    var payment = paymentValue();
    if (!isName(name)) {
      setFieldError('checkoutName', t('err_name'));
      valid = false;
    }
    if (!isEgyptianPhone(phone)) {
      setFieldError('checkoutPhone', t('err_phone'));
      valid = false;
    }
    if (!gov) {
      setFieldError('checkoutGov', t('err_required'));
      valid = false;
    }
    if (floor === '') {
      setFieldError('checkoutFloor', t('err_floor'));
      valid = false;
    }
    if (!payment) {
      setFieldError('paymentMethod', t('err_payment'));
      valid = false;
    }
    if (!valid) {
      var firstInvalid = refs.checkoutForm ? $('.invalid', refs.checkoutForm) : null;
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: REDUCED_MOTION ? 'auto' : 'smooth', block: 'center' });
        if (typeof firstInvalid.focus === 'function') firstInvalid.focus({ preventScroll: true });
      }
    }
    return valid;
  }

  /* ------------------------------------------------------------------------
     Account interface
     ------------------------------------------------------------------------ */

  function showAuthBanner(message, isError) {
    if (!refs.authBanner) return;
    refs.authBanner.textContent = message || '';
    refs.authBanner.classList.toggle('show', !!message);
    refs.authBanner.classList.toggle('error', !!isError);
  }

  function updateAuthHeading() {
    if (!refs.authTitle || !refs.authSubtitle) return;
    var signup = state.authMode === 'signup';
    refs.authTitle.textContent = signup ? t('auth_title_signup') : t('auth_title_signin');
    refs.authSubtitle.textContent = signup ? t('auth_subtitle_signup') : t('auth_subtitle_signin');
  }

  function switchAuthTab(mode, focus) {
    state.authMode = mode === 'signup' ? 'signup' : 'signin';
    var signup = state.authMode === 'signup';
    if (refs.signInTab) {
      refs.signInTab.classList.toggle('active', !signup);
      refs.signInTab.setAttribute('aria-selected', signup ? 'false' : 'true');
    }
    if (refs.signUpTab) {
      refs.signUpTab.classList.toggle('active', signup);
      refs.signUpTab.setAttribute('aria-selected', signup ? 'true' : 'false');
    }
    if (refs.signInForm) refs.signInForm.hidden = signup;
    if (refs.signUpForm) refs.signUpForm.hidden = !signup;
    clearFormErrors(signup ? refs.signUpForm : refs.signInForm);
    showAuthBanner('');
    updateAuthHeading();
    if (focus) {
      var target = signup ? refs.signUpName : refs.signInEmail;
      if (target) window.setTimeout(function () { target.focus({ preventScroll: true }); }, 80);
    }
  }

  function renderProfile() {
    var account = currentAccount();
    if (!account) return;
    if (refs.profileName) refs.profileName.textContent = account.name;
    if (refs.profileEmail) refs.profileEmail.textContent = account.email;
    if (refs.profileAvatar) {
      refs.profileAvatar.textContent = (account.name || 'N').trim().charAt(0).toUpperCase();
    }
    var orders = Array.isArray(account.orders) ? account.orders : [];
    if (refs.profileOrdersCount) refs.profileOrdersCount.textContent = String(orders.length);
    if (refs.profileWishCount) refs.profileWishCount.textContent = String(state.wishlist.length);
    if (refs.profileCartCount) refs.profileCartCount.textContent = String(cartQuantity());
    if (refs.profileOrdersList) {
      if (!orders.length) {
        refs.profileOrdersList.innerHTML = '<div class="profile-empty">' + esc(t('no_orders')) + '</div>';
      } else {
        refs.profileOrdersList.innerHTML = orders.slice(0, 3).map(function (order) {
          return '<div class="order-mini">' +
            '<div><strong>#' + esc(order.id) + '</strong><br><span>' + esc(formatDate(order.createdAt)) + '</span></div>' +
            '<span>' + money(order.total) + '</span>' +
            '</div>';
        }).join('');
      }
    }
  }

  function showProfilePanel() {
    if (refs.authForms) refs.authForms.hidden = true;
    if (refs.profilePanel) refs.profilePanel.hidden = false;
    renderProfile();
  }

  function showAuthForms() {
    if (refs.authForms) refs.authForms.hidden = false;
    if (refs.profilePanel) refs.profilePanel.hidden = true;
    updateAuthHeading();
  }

  function finishAuth(account, isNew) {
    state.sessionId = account.id;
    writeText(STORE_KEYS.session, account.id);
    updateAccountLabel();
    renderProfile();
    prefillCheckout();
    if (isNew) {
      postWebhook({
        type: 'signup',
        name: account.name,
        email: account.email,
        phone: account.phone,
        governorate: account.governorate,
        createdAt: account.createdAt,
        pageUrl: window.location.href
      });
      trackPixel('Lead', { content_name: 'Account Signup', currency: 'EGP', value: 0 });
      showToast(t('account_created', { name: account.name.split(' ')[0] }));
    } else {
      showToast(t('welcome', { name: account.name.split(' ')[0] }));
    }
    if (state.pendingCheckout) {
      state.pendingCheckout = false;
      closeAuth(false);
      window.setTimeout(function () {
        openCart();
        showCheckoutSuccess(t('resume_success'));
      }, 180);
    } else {
      showProfilePanel();
    }
  }

  function handleSignIn(event) {
    event.preventDefault();
    if (!refs.signInForm) return;
    clearFormErrors(refs.signInForm);
    showAuthBanner('');
    var email = refs.signInEmail ? refs.signInEmail.value.trim().toLowerCase() : '';
    var password = refs.signInPassword ? refs.signInPassword.value : '';
    var valid = true;
    if (!isEmail(email)) {
      setFieldError('signInEmail', t('err_email'));
      valid = false;
    }
    if (!password) {
      setFieldError('signInPassword', t('err_required'));
      valid = false;
    }
    if (!valid) return;
    var account = state.accounts.find(function (record) { return record.email.toLowerCase() === email; });
    if (!account) {
      showAuthBanner(t('err_credentials'), true);
      return;
    }
    var submit = $('button[type="submit"]', refs.signInForm);
    if (submit) {
      submit.disabled = true;
      submit.dataset.originalText = submit.textContent;
      submit.textContent = t('auth_busy');
    }
    verifyPassword(account, password).then(function (match) {
      if (submit) {
        submit.disabled = false;
        if (submit.dataset.originalText) submit.textContent = submit.dataset.originalText;
      }
      if (!match) {
        showAuthBanner(t('err_credentials'), true);
        return;
      }
      refs.signInForm.reset();
      finishAuth(account, false);
    }).catch(function () {
      if (submit) {
        submit.disabled = false;
        if (submit.dataset.originalText) submit.textContent = submit.dataset.originalText;
      }
      showAuthBanner(t('err_secure'), true);
    });
  }

  function handleSignUp(event) {
    event.preventDefault();
    if (!refs.signUpForm) return;
    clearFormErrors(refs.signUpForm);
    showAuthBanner('');
    var valid = validateAccountDetails('signUp');
    var gov = refs.signUpGov ? refs.signUpGov.value : '';
    var password = refs.signUpPassword ? refs.signUpPassword.value : '';
    var confirm = refs.signUpConfirm ? refs.signUpConfirm.value : '';
    if (!gov) {
      setFieldError('signUpGov', t('err_required'));
      valid = false;
    }
    if (password !== confirm) {
      setFieldError('signUpConfirm', t('err_confirm'));
      valid = false;
    }
    var email = refs.signUpEmail ? refs.signUpEmail.value.trim() : '';
    var exists = state.accounts.some(function (record) { return record.email.toLowerCase() === email.toLowerCase(); });
    if (exists) {
      setFieldError('signUpEmail', t('err_exists'));
      valid = false;
    }
    if (!valid) return;
    var submit = $('button[type="submit"]', refs.signUpForm);
    if (submit) {
      submit.disabled = true;
      submit.dataset.originalText = submit.textContent;
      submit.textContent = t('auth_busy');
    }
    createPasswordRecord(password).then(function (record) {
      var account = {
        id: 'acc_' + Date.now().toString(36) + randomToken(6),
        name: refs.signUpName.value.trim(),
        email: email,
        phone: normalizePhone(refs.signUpPhone.value),
        governorate: gov,
        passwordSalt: record.salt,
        passwordHash: record.hash,
        createdAt: new Date().toISOString(),
        lastFloor: null,
        orders: []
      };
      state.accounts.push(account);
      saveAccounts();
      if (submit) {
        submit.disabled = false;
        if (submit.dataset.originalText) submit.textContent = submit.dataset.originalText;
      }
      refs.signUpForm.reset();
      if (refs.passwordMeter) {
        refs.passwordMeter.style.width = '0%';
        refs.passwordMeter.classList.remove('medium', 'strong');
      }
      finishAuth(account, true);
    }).catch(function () {
      if (submit) {
        submit.disabled = false;
        if (submit.dataset.originalText) submit.textContent = submit.dataset.originalText;
      }
      showAuthBanner(t('err_secure'), true);
    });
  }

  function handleSignOut() {
    state.sessionId = '';
    try { window.localStorage.removeItem(STORE_KEYS.session); } catch (error) { /* Ignore storage errors. */ }
    updateAccountLabel();
    switchAuthTab('signin', false);
    showAuthForms();
    if (refs.signInForm) refs.signInForm.reset();
    if (refs.signUpForm) refs.signUpForm.reset();
    showToast(t('signed_out'));
  }

  /* ------------------------------------------------------------------------
     Orders, webhook and WhatsApp handoff
     ------------------------------------------------------------------------ */

  function floorText(value) {
    if (String(value) === '0') return state.lang === 'ar' ? 'أرضي' : 'Ground';
    return String(value);
  }

  function newOrderId() {
    var now = new Date();
    var stamp = String(now.getFullYear()) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    return 'NLM-' + stamp + '-' + randomToken(4).toUpperCase();
  }

  function postWebhook(payload) {
    var url = String(CFG.googleSheetWebhookUrl || '').trim();
    if (!url) return;
    try {
      fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      }).catch(function () {
        /* Silent by design: the order continues through WhatsApp. */
      });
    } catch (error) {
      /* Older browsers may reject the request; WhatsApp remains the source of truth. */
    }
  }

  function openWhatsApp(message) {
    var number = String(CFG.whatsappNumber || '201132284750').replace(/\D/g, '');
    var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(message);
    var link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    window.setTimeout(function () {
      if (link.parentNode) link.parentNode.removeChild(link);
    }, 600);
  }

  function buildOrderMessage(order) {
    var lines = [];
    lines.push('✦ NEW NALAM ORDER / طلب جديد من نالام ✦');
    lines.push('');
    lines.push('Order reference / رقم الطلب: ' + order.id);
    lines.push('Customer / العميل: ' + order.customer.name);
    lines.push('Phone / الهاتف: ' + order.customer.phone);
    if (order.customer.email) lines.push('Email / البريد: ' + order.customer.email);
    lines.push('Governorate / المحافظة: ' + (order.governorate === 'Cairo' ? 'Cairo / القاهرة' : 'Giza / الجيزة'));
    lines.push('Floor / الدور: ' + floorText(order.floor) + ' (installation logistics / للتركيب)');
    lines.push('Payment / الدفع: ' + (order.paymentMethod === 'InstaPay' ? 'InstaPay / إنستاباي' : 'Mobile Wallet / المحفظة الإلكترونية'));
    lines.push('');
    lines.push('──────────────');
    lines.push('ITEMS / القطع');
    order.items.forEach(function (item, index) {
      lines.push((index + 1) + '. ' + item.titleEn + ' / ' + item.titleAr);
      lines.push('   ' + item.code + ' · ' + item.dimensions);
      lines.push('   Qty / الكمية: ' + item.qty + ' × ' + money(item.unitPrice));
      if (item.qty > 1) lines.push('   Line total / إجمالي القطعة: ' + money(item.lineTotal));
    });
    lines.push('──────────────');
    lines.push('Items subtotal / إجمالي القطع: ' + money(order.subtotal));
    lines.push('Delivery & installation / التوصيل والتركيب: ' + money(order.delivery));
    lines.push('Per-floor surcharge / رسوم إضافية للدور: 0 EGP');
    lines.push('TOTAL / الإجمالي: ' + money(order.total));
    lines.push('');
    lines.push('Flat-rate 5,000 EGP delivery & professional installation across anywhere in Cairo & Giza (up to 2nd floor) applies to any order size, whether single pieces or full rooms.');
    lines.push('التوصيل والتركيب الاحترافي بسعر ثابت 5,000 جنيه مصري في أي مكان بالقاهرة والجيزة (حتى الدور الثاني) ينطبق على أي حجم طلب، سواء قطعة واحدة أو غرف كاملة.');
    lines.push('');
    lines.push('Thank you / شكراً — Nalam / نالام');
    lines.push('Your Zone Is Glam. / مساحتك بأناقة فاخرة.');
    return lines.join('\n');
  }

  function saveOrderToAccount(order) {
    var account = currentAccount();
    if (!account) return;
    if (!Array.isArray(account.orders)) account.orders = [];
    account.orders.unshift(order);
    account.orders = account.orders.slice(0, 30);
    account.lastFloor = order.floor;
    if (!account.phone && order.customer.phone) account.phone = order.customer.phone;
    if (!account.governorate && order.governorate) account.governorate = order.governorate;
    saveAccounts();
    renderProfile();
  }

  function resetCheckoutForm() {
    if (!refs.checkoutForm) return;
    refs.checkoutForm.reset();
    clearFormErrors(refs.checkoutForm);
    if (refs.checkoutSuccess) {
      refs.checkoutSuccess.classList.remove('show');
      refs.checkoutSuccess.textContent = '';
    }
    prefillCheckout();
    syncPaymentDetails();
  }

  function handleConfirmOrder() {
    if (!state.cart.length) {
      showToast(t('empty_cart'));
      return;
    }
    var account = currentAccount();
    if (!account) {
      state.pendingCheckout = true;
      closeCart(false);
      openAuth('signin');
      showAuthBanner(t('auth_banner'));
      return;
    }
    if (!validateCheckout()) return;
    var details = cartDetails();
    var subtotal = cartSubtotal();
    var delivery = deliveryFee();
    var total = cartTotal();
    var method = paymentValue();
    var order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      status: t('order_status'),
      accountId: account.id,
      customer: {
        name: refs.checkoutName.value.trim(),
        phone: normalizePhone(refs.checkoutPhone.value),
        email: account.email
      },
      governorate: refs.checkoutGov.value,
      floor: Number(refs.checkoutFloor.value),
      paymentMethod: method,
      items: details.map(function (entry) {
        return {
          id: entry.product.id,
          code: entry.product.code,
          titleEn: entry.product.titleEn,
          titleAr: entry.product.titleAr,
          dimensions: entry.product.dimensions,
          qty: entry.qty,
          unitPrice: entry.product.priceEgp,
          lineTotal: entry.lineTotal
        };
      }),
      subtotal: subtotal,
      delivery: delivery,
      total: total,
      currency: 'EGP',
      language: state.lang,
      pageUrl: window.location.href
    };

    trackPixel('InitiateCheckout', {
      content_ids: order.items.map(function (item) { return item.id; }),
      content_type: 'product',
      contents: order.items.map(function (item) {
        return { id: item.id, quantity: item.qty, item_price: item.unitPrice };
      }),
      value: total,
      currency: 'EGP',
      num_items: order.items.reduce(function (sum, item) { return sum + item.qty; }, 0)
    });
    postWebhook(Object.assign({ type: 'order' }, order));
    saveOrderToAccount(order);
    state.lastOrder = order;
    openWhatsApp(buildOrderMessage(order));
    state.cart = [];
    saveCart();
    renderCart();
    updateBadges(false, false);
    resetCheckoutForm();
    closeCart(false);
    showToast(t('order_sent') + ' ' + t('order_saved', { id: order.id }));
  }

  /* ------------------------------------------------------------------------
     Consultation form
     ------------------------------------------------------------------------ */

  function handleContactSubmit(event) {
    event.preventDefault();
    var form = refs.contactForm;
    if (!form) return;
    clearFormErrors(form);
    var name = refs.contactName ? refs.contactName.value.trim() : '';
    var phone = refs.contactPhone ? refs.contactPhone.value : '';
    var gov = refs.contactGov ? refs.contactGov.value : '';
    var interest = refs.contactInterest ? refs.contactInterest.value : '';
    var message = refs.contactMessage ? refs.contactMessage.value.trim() : '';
    var valid = true;
    if (!isName(name)) {
      setFieldError('contactName', t('err_name'));
      valid = false;
    }
    if (!isEgyptianPhone(phone)) {
      setFieldError('contactPhone', t('err_phone'));
      valid = false;
    }
    if (!gov) {
      setFieldError('contactGov', t('err_required'));
      valid = false;
    }
    if (!interest) {
      setFieldError('contactInterest', t('err_required'));
      valid = false;
    }
    if (!valid) {
      var first = $('.invalid', form);
      if (first) first.focus({ preventScroll: true });
      return;
    }
    var lines = [];
    lines.push('✦ NEW NALAM CONSULTATION / استشارة جديدة من نالام ✦');
    lines.push('');
    lines.push('Name / الاسم: ' + name);
    lines.push('Phone / الهاتف: ' + normalizePhone(phone));
    lines.push('Governorate / المحافظة: ' + (gov === 'Cairo' ? 'Cairo / القاهرة' : 'Giza / الجيزة'));
    lines.push('Interested in / المهتم به: ' + interest);
    if (message) {
      lines.push('');
      lines.push('Message / الرسالة:');
      lines.push(message);
    }
    lines.push('');
    lines.push('Please send this message so our designers can reply. / يرجى إرسال هذه الرسالة ليرد مصممونا.');
    openWhatsApp(lines.join('\n'));
    if (refs.contactSuccess) refs.contactSuccess.classList.add('show');
    showToast(t('contact_ready'));
    form.reset();
  }

  /* ------------------------------------------------------------------------
     Toast and overlay management
     ------------------------------------------------------------------------ */

  var toastTimer = null;

  function showToast(message) {
    if (!refs.toast) return;
    refs.toast.textContent = message;
    refs.toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      refs.toast.classList.remove('show');
    }, 3400);
  }

  function overlayOpen() {
    return !!(
      (refs.mobileDrawer && refs.mobileDrawer.classList.contains('open')) ||
      (refs.cartDrawer && refs.cartDrawer.classList.contains('open')) ||
      (refs.wishlistDrawer && refs.wishlistDrawer.classList.contains('open')) ||
      (refs.productModalBackdrop && refs.productModalBackdrop.classList.contains('open')) ||
      (refs.authModalBackdrop && refs.authModalBackdrop.classList.contains('open')) ||
      (refs.zoomModal && refs.zoomModal.classList.contains('open'))
    );
  }

  function lockBody() {
    document.body.style.overflow = 'hidden';
  }

  function unlockBody() {
    if (!overlayOpen()) document.body.style.overflow = '';
  }

  function rememberFocus() {
    state.lastFocus = document.activeElement;
  }

  function restoreFocus() {
    if (state.lastFocus && typeof state.lastFocus.focus === 'function') {
      try { state.lastFocus.focus({ preventScroll: true }); } catch (error) { /* Ignore detached nodes. */ }
    }
  }

  function openCart() {
    if (!refs.cartDrawer) return;
    closeProduct(false);
    closeWishlist(false);
    closeAuth(false);
    closeMobile(false);
    rememberFocus();
    renderCart();
    prefillCheckout();
    refs.cartBackdrop.classList.add('open');
    refs.cartDrawer.classList.add('open');
    refs.cartDrawer.setAttribute('aria-hidden', 'false');
    lockBody();
    var close = $('[data-close-cart]', refs.cartDrawer);
    if (close) window.setTimeout(function () { close.focus({ preventScroll: true }); }, 80);
  }

  function closeCart(restore) {
    if (!refs.cartDrawer) return;
    refs.cartDrawer.classList.remove('open');
    refs.cartDrawer.setAttribute('aria-hidden', 'true');
    if (refs.cartBackdrop) refs.cartBackdrop.classList.remove('open');
    unlockBody();
    if (restore !== false) restoreFocus();
  }

  function openWishlist() {
    if (!refs.wishlistDrawer) return;
    closeCart(false);
    closeProduct(false);
    closeAuth(false);
    closeMobile(false);
    rememberFocus();
    renderWishlist();
    refs.wishlistBackdrop.classList.add('open');
    refs.wishlistDrawer.classList.add('open');
    refs.wishlistDrawer.setAttribute('aria-hidden', 'false');
    lockBody();
    var close = $('[data-close-wishlist]', refs.wishlistDrawer);
    if (close) window.setTimeout(function () { close.focus({ preventScroll: true }); }, 80);
  }

  function closeWishlist(restore) {
    if (!refs.wishlistDrawer) return;
    refs.wishlistDrawer.classList.remove('open');
    refs.wishlistDrawer.setAttribute('aria-hidden', 'true');
    if (refs.wishlistBackdrop) refs.wishlistBackdrop.classList.remove('open');
    unlockBody();
    if (restore !== false) restoreFocus();
  }

  function openAuth(mode) {
    if (!refs.authModalBackdrop) return;
    closeCart(false);
    closeWishlist(false);
    closeProduct(false);
    closeMobile(false);
    rememberFocus();
    var account = currentAccount();
    if (account) {
      showProfilePanel();
    } else {
      showAuthForms();
      switchAuthTab(mode || 'signin', false);
      if (state.pendingCheckout) showAuthBanner(t('auth_banner'));
    }
    refs.authModalBackdrop.classList.add('open');
    lockBody();
    if (!account) {
      var target = state.authMode === 'signup' ? refs.signUpName : refs.signInEmail;
      if (target) window.setTimeout(function () { target.focus({ preventScroll: true }); }, 120);
    }
  }

  function closeAuth(restore) {
    if (!refs.authModalBackdrop) return;
    refs.authModalBackdrop.classList.remove('open');
    unlockBody();
    if (restore !== false) restoreFocus();
  }

  function openMobile() {
    if (!refs.mobileDrawer) return;
    refs.mobileDrawer.classList.add('open');
    refs.mobileDrawerBackdrop.classList.add('open');
    refs.mobileDrawer.setAttribute('aria-hidden', 'false');
    if (refs.mobileMenuBtn) refs.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    lockBody();
    if (refs.mobileDrawerCloseBtn) refs.mobileDrawerCloseBtn.focus({ preventScroll: true });
  }

  function closeMobile(restore) {
    if (!refs.mobileDrawer) return;
    refs.mobileDrawer.classList.remove('open');
    if (refs.mobileDrawerBackdrop) refs.mobileDrawerBackdrop.classList.remove('open');
    refs.mobileDrawer.setAttribute('aria-hidden', 'true');
    if (refs.mobileMenuBtn) {
      refs.mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (restore !== false) refs.mobileMenuBtn.focus({ preventScroll: true });
    }
    unlockBody();
  }

  function renderModalProduct() {
    var product = PRODUCT_MAP.get(state.currentProductId);
    if (!product) return;
    var index = state.modalImageIndex || 0;
    if (index >= product.images.length) index = 0;
    state.modalImageIndex = index;
    if (refs.modalCategory) refs.modalCategory.textContent = categoryName(product.category).toUpperCase();
    if (refs.modalProductTitle) refs.modalProductTitle.textContent = productTitle(product);
    if (refs.modalPrice) refs.modalPrice.textContent = money(product.priceEgp);
    if (refs.modalDimensions) refs.modalDimensions.textContent = product.dimensions;
    if (refs.modalMaterial) refs.modalMaterial.textContent = productMaterial(product);
    if (refs.modalHardware) refs.modalHardware.textContent = productHardware(product);
    if (refs.modalFinish) refs.modalFinish.textContent = productFinish(product);
    if (refs.modalCode) refs.modalCode.textContent = product.code;
    if (refs.modalMainLabel) refs.modalMainLabel.textContent = productImageLabel(product, index);
    if (refs.modalMainImg) {
      refs.modalMainImg.alt = productTitle(product) + ' — ' + productImageLabel(product, index);
      applyProductPhoto(refs.modalMainImg, product, index);
    }
    if (refs.modalThumbs) {
      refs.modalThumbs.innerHTML = product.images.map(function (image, imageIndex) {
        return '<button type="button" class="modal-thumb' + (imageIndex === index ? ' active' : '') + '" data-modal-thumb="' + imageIndex + '" aria-label="' + esc(state.lang === 'ar' ? image.labelAr : image.labelEn) + '">' +
          '<img alt="' + esc(state.lang === 'ar' ? image.labelAr : image.labelEn) + '" width="240" height="180" loading="lazy" decoding="async">' +
          '<span>' + esc(state.lang === 'ar' ? image.labelAr : image.labelEn) + '</span>' +
          '</button>';
      }).join('');
      $$('.modal-thumb img', refs.modalThumbs).forEach(function (img, imageIndex) {
        applyProductPhoto(img, product, imageIndex);
      });
    }
    if (refs.modalQty) refs.modalQty.textContent = String(state.modalQty);
    if (refs.modalWishlist) {
      var saved = state.wishlist.indexOf(product.id) !== -1;
      refs.modalWishlist.classList.toggle('saved', saved);
      refs.modalWishlist.setAttribute('aria-pressed', saved ? 'true' : 'false');
      refs.modalWishlist.textContent = saved ? '♥' : '♡';
      refs.modalWishlist.setAttribute('aria-label', state.lang === 'ar' ? 'حفظ في المفضلة' : 'Save to wishlist');
    }
  }

  function openProduct(productId) {
    var product = PRODUCT_MAP.get(productId);
    if (!product || !refs.productModalBackdrop) return;
    closeCart(false);
    closeWishlist(false);
    closeAuth(false);
    closeMobile(false);
    rememberFocus();
    state.currentProductId = productId;
    state.modalQty = 1;
    state.modalImageIndex = 0;
    renderModalProduct();
    refs.productModalBackdrop.classList.add('open');
    lockBody();
    var close = $('.modal-close', refs.productModalBackdrop);
    if (close) window.setTimeout(function () { close.focus({ preventScroll: true }); }, 80);
    trackPixel('ViewContent', {
      content_ids: [product.id],
      content_name: product.titleEn,
      content_type: 'product',
      value: product.priceEgp,
      currency: 'EGP'
    });
  }

  function closeProduct(restore) {
    if (!refs.productModalBackdrop) return;
    refs.productModalBackdrop.classList.remove('open');
    unlockBody();
    if (restore !== false) restoreFocus();
  }

  function openZoom(src, alt) {
    if (!refs.zoomModal || !refs.zoomModalImg) return;
    refs.zoomModalImg.src = src || 'assets/logo.png';
    refs.zoomModalImg.alt = alt || 'Nalam';
    refs.zoomModal.classList.add('open');
    lockBody();
    if (refs.zoomClose) refs.zoomClose.focus({ preventScroll: true });
  }

  function closeZoom() {
    if (!refs.zoomModal) return;
    refs.zoomModal.classList.remove('open');
    unlockBody();
  }

  function closeAllPanels() {
    closeMobile(false);
    closeCart(false);
    closeWishlist(false);
    closeAuth(false);
    closeProduct(false);
    closeZoom();
  }

  /* ------------------------------------------------------------------------
     Language application
     ------------------------------------------------------------------------ */

  var EN_TITLE = '';
  var AR_TITLE = '';
  var EN_DESCRIPTION = '';
  var AR_DESCRIPTION = '';

  function applyLanguage(lang, persist) {
    state.lang = lang === 'ar' ? 'ar' : 'en';
    var isArabic = state.lang === 'ar';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.title = isArabic ? AR_TITLE : EN_TITLE;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', isArabic ? AR_DESCRIPTION : EN_DESCRIPTION);
    }
    $$('[data-i18n]').forEach(function (node) {
      var key = node.dataset.i18n;
      var original = node.dataset.i18nEn != null ? node.dataset.i18nEn : node.innerHTML;
      if (isArabic && AR[key] != null) node.innerHTML = AR[key];
      else node.innerHTML = original;
    });
    var placeholders = PLACEHOLDERS[state.lang] || PLACEHOLDERS.en;
    Object.keys(placeholders).forEach(function (id) {
      var field = document.getElementById(id);
      if (field) field.setAttribute('placeholder', placeholders[id]);
    });
    $$('[data-config-hours]').forEach(function (node) {
      node.textContent = isArabic ? AR.showroom_hours : (CFG.showroomHoursEn || AR.showroom_hours);
    });
    $$('[data-lang-toggle]').forEach(function (button) {
      button.setAttribute('aria-label', isArabic ? 'Switch to English' : 'التبديل إلى العربية');
    });
    updateAccountLabel();
    renderCatalogue();
    renderCart();
    renderWishlist();
    updateBadges(false, false);
    syncPaymentDetails();
    updateAuthHeading();
    $$('.toggle-pass').forEach(function (button) {
      var field = document.getElementById(button.dataset.togglePassword);
      var visible = field && field.type === 'text';
      button.textContent = visible ? (isArabic ? 'إخفاء' : 'Hide') : (isArabic ? 'إظهار' : 'Show');
    });
    if (state.currentProductId && refs.productModalBackdrop && refs.productModalBackdrop.classList.contains('open')) {
      renderModalProduct();
    }
    if (state.pendingCheckout) showAuthBanner(t('auth_banner'));
    var account = currentAccount();
    if (account) renderProfile();
    updateHeroStage(true);
    updateProcessStage(true);
    if (persist) saveLanguage();
  }

  /* ------------------------------------------------------------------------
     Scroll storytelling
     ------------------------------------------------------------------------ */

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function updateHeroStage(force) {
    if (!refs.heroTrack || !refs.stageLayers.length) return;
    var rect = refs.heroTrack.getBoundingClientRect();
    var distance = Math.max(1, rect.height - window.innerHeight);
    var progress = clamp(-rect.top / distance, 0, 1);
    var count = 6;
    var index = Math.min(count - 1, Math.floor(progress * count));
    if (index !== state.heroStage || force) {
      state.heroStage = index;
      refs.stageLayers.forEach(function (layer) {
        var stage = parseInt(layer.dataset.stage, 10);
        layer.classList.toggle('visible', stage <= index);
      });
      refs.heroChapterNodes.forEach(function (chapter, chapterIndex) {
        chapter.classList.toggle('active', chapterIndex === index);
      });
      refs.stageDots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
      var chapter = refs.heroChapterNodes[index];
      if (chapter && refs.stageCaptionTitle) {
        var heading = chapter.querySelector('h2');
        refs.stageCaptionTitle.textContent = heading ? heading.textContent : '';
      }
      if (refs.stageCounter) {
        refs.stageCounter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(count).padStart(2, '0');
      }
    }
    if (refs.stageProgressFill) refs.stageProgressFill.style.width = (progress * 100).toFixed(2) + '%';
  }

  function scrollToStage(index) {
    if (!refs.heroTrack) return;
    var trackTop = refs.heroTrack.getBoundingClientRect().top + window.pageYOffset;
    var distance = Math.max(1, refs.heroTrack.offsetHeight - window.innerHeight);
    var target = trackTop + distance * clamp((index + 0.5) / 6, 0.02, 0.98);
    window.scrollTo({ top: target, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
  }

  function updateProcessStage(force) {
    if (!refs.processImageNodes.length || !refs.processStepNodes.length) return;
    var center = window.innerHeight * 0.48;
    var closest = 0;
    var closestDistance = Infinity;
    refs.processStepNodes.forEach(function (step, index) {
      var rect = step.getBoundingClientRect();
      var stepCenter = rect.top + rect.height / 2;
      var distance = Math.abs(stepCenter - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    if (closest === state.processStage && !force) return;
    state.processStage = closest;
    refs.processImageNodes.forEach(function (image, index) {
      image.classList.toggle('active', index === closest);
    });
    var step = refs.processStepNodes[closest];
    if (step) {
      step.classList.add('is-active');
      refs.processStepNodes.forEach(function (other, index) {
        if (index !== closest) other.classList.remove('is-active');
      });
      var heading = step.querySelector('h3');
      var number = step.querySelector('.step-number');
      if (refs.processCaptionTitle && heading) refs.processCaptionTitle.textContent = heading.textContent;
      if (refs.processCaptionSub && number) refs.processCaptionSub.textContent = number.textContent;
    }
  }

  function updateActiveNav() {
    if (!refs.navLinks.length) return;
    var threshold = 150;
    var activeId = '';
    ['showcase', 'stages', 'catalogue', 'materials', 'contact'].forEach(function (id) {
      var section = document.getElementById(id);
      if (!section) return;
      var rect = section.getBoundingClientRect();
      if (rect.top <= threshold && rect.bottom > threshold) activeId = id;
    });
    if (!activeId) return;
    refs.navLinks.forEach(function (link) {
      link.classList.toggle('active', link.dataset.nav === activeId);
    });
  }

  function handleScroll() {
    var header = document.querySelector('.site-header');
    if (header) header.classList.toggle('is-scrolled', window.pageYOffset > 18);
    if (refs.backToTop) refs.backToTop.classList.toggle('show', window.pageYOffset > 640);
    updateHeroStage(false);
    updateProcessStage(false);
    updateActiveNav();
  }

  function initReveal() {
    var nodes = $$('.reveal');
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) {
      nodes.forEach(function (node) { node.classList.add('is-visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    nodes.forEach(function (node) { observer.observe(node); });
  }

  function initScrollEffects() {
    var ticking = false;
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        ticking = false;
        handleScroll();
      });
    }
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    handleScroll();
  }

  function smoothScrollTo(hash) {
    if (!hash || hash === '#') return;
    if (hash === '#top' || hash === '#main') {
      window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
      if (hash === '#main') {
        var main = document.getElementById('main');
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus({ preventScroll: true });
        }
      }
      return;
    }
    var target = document.getElementById(hash.replace('#', ''));
    if (!target) return;
    var header = document.querySelector('.site-header');
    var offset = header ? header.offsetHeight + 16 : 20;
    var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: REDUCED_MOTION ? 'auto' : 'smooth' });
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', hash);
    }
  }

  /* ------------------------------------------------------------------------
     Input helpers
     ------------------------------------------------------------------------ */

  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value).then(function () {
        showToast(t('copied'));
      }).catch(function () {
        showToast(t('copy_failed'));
      });
    }
    try {
      var area = document.createElement('textarea');
      area.value = value;
      area.setAttribute('readonly', 'readonly');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
      showToast(t('copied'));
    } catch (error) {
      showToast(t('copy_failed'));
    }
    return Promise.resolve();
  }

  function togglePassword(button) {
    var field = document.getElementById(button.dataset.togglePassword);
    if (!field) return;
    var visible = field.type === 'text';
    field.type = visible ? 'password' : 'text';
    button.textContent = visible ? (state.lang === 'ar' ? 'إظهار' : 'Show') : (state.lang === 'ar' ? 'إخفاء' : 'Hide');
    button.setAttribute('aria-label', visible ? 'Show password' : 'Hide password');
  }

  function updatePasswordMeter() {
    if (!refs.signUpPassword || !refs.passwordMeter) return;
    var value = refs.signUpPassword.value;
    var score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Za-z]/.test(value) && /\d/.test(value)) score += 1;
    if (value.length >= 11) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;
    var width = score <= 1 ? '30%' : (score === 2 ? '58%' : (score === 3 ? '82%' : '100%'));
    refs.passwordMeter.style.width = value ? width : '0%';
    refs.passwordMeter.classList.toggle('medium', score >= 2);
    refs.passwordMeter.classList.toggle('strong', score >= 3);
  }

  /* ------------------------------------------------------------------------
     Element references and storm of small interactions
     ------------------------------------------------------------------------ */

  function captureRefs() {
    var ids = [
      'mobileDrawer', 'mobileDrawerBackdrop', 'mobileMenuBtn', 'mobileDrawerCloseBtn',
      'heroChapters', 'heroStageDots', 'stageCaptionTitle', 'stageCounter', 'stageProgressFill', 'roomStageFrame',
      'processSteps', 'processCaptionTitle', 'processCaptionSub',
      'filterBar', 'catalogueGrid',
      'cartBackdrop', 'cartDrawer', 'cartHeadMeta', 'cartItemsSection', 'cartItemsCount', 'cartItems', 'cartEmptyState',
      'checkoutForm', 'checkoutName', 'checkoutPhone', 'checkoutGov', 'checkoutFloor', 'checkoutAccountNote',
      'paymentDetailsBox', 'paymentDetailValue', 'paymentDetailNote',
      'cartFooter', 'flatRateBadge', 'summaryItems', 'summaryDelivery', 'summaryTotal', 'deliveryPromiseNote',
      'checkoutSuccess', 'confirmOrderBtn',
      'wishlistBackdrop', 'wishlistDrawer', 'wishlistHeadMeta', 'wishlistItems', 'wishlistEmptyState',
      'productModalBackdrop', 'productModal', 'modalMain', 'modalMainImg', 'modalMainLabel', 'modalThumbs',
      'modalCategory', 'modalProductTitle', 'modalPrice', 'modalQty', 'modalAddToCart', 'modalWishlist',
      'modalDimensions', 'modalMaterial', 'modalHardware', 'modalFinish', 'modalCode',
      'authModalBackdrop', 'authForms', 'authTitle', 'authSubtitle', 'signInTab', 'signUpTab',
      'signInForm', 'signUpForm', 'authBanner', 'signInEmail', 'signInPassword',
      'signUpName', 'signUpPhone', 'signUpGov', 'signUpEmail', 'signUpPassword', 'signUpConfirm', 'passwordMeter',
      'profilePanel', 'profileAvatar', 'profileName', 'profileEmail', 'profileOrdersCount', 'profileWishCount',
      'profileCartCount', 'profileOrdersList', 'signOutBtn',
      'zoomModal', 'zoomModalImg', 'zoomClose', 'toast', 'backToTop',
      'contactForm', 'contactName', 'contactPhone', 'contactGov', 'contactInterest', 'contactMessage', 'contactSuccess',
      'footerYear'
    ];
    ids.forEach(function (id) {
      refs[id] = document.getElementById(id);
    });
    refs.heroTrack = document.getElementById('showcase');
    refs.stageDots = $$('[data-stage-dot]');
    refs.stageLayers = $$('.room-layer[data-stage]');
    refs.heroChapterNodes = $$('.hero-chapter');
    refs.processImageNodes = $$('.process-image');
    refs.processStepNodes = $$('.process-step');
    refs.navLinks = $$('[data-nav]');
    refs.langToggles = $$('[data-lang-toggle]');
  }

  function handleDocumentClick(event) {
    var target = event.target;
    if (!target || !target.closest) return;

    var copyButton = target.closest('[data-copy-target]');
    if (copyButton) {
      var source = document.getElementById(copyButton.dataset.copyTarget);
      if (source) copyText(source.textContent.trim());
      return;
    }

    var langButton = target.closest('[data-lang-toggle]');
    if (langButton) {
      applyLanguage(state.lang === 'ar' ? 'en' : 'ar', true);
      return;
    }

    var filter = target.closest('[data-filter]');
    if (filter) {
      setFilter(filter.dataset.filter);
      return;
    }

    var cartInc = target.closest('[data-cart-inc]');
    if (cartInc) {
      var incEntry = state.cart.find(function (entry) { return entry.id === cartInc.dataset.cartInc; });
      if (incEntry) setCartQty(incEntry.id, incEntry.qty + 1);
      return;
    }
    var cartDec = target.closest('[data-cart-dec]');
    if (cartDec) {
      var decEntry = state.cart.find(function (entry) { return entry.id === cartDec.dataset.cartDec; });
      if (decEntry) setCartQty(decEntry.id, decEntry.qty - 1);
      return;
    }
    var cartRemove = target.closest('[data-cart-remove]');
    if (cartRemove) {
      removeCartItem(cartRemove.dataset.cartRemove);
      return;
    }

    var wishAdd = target.closest('[data-wishlist-add]');
    if (wishAdd) {
      addToCart(wishAdd.dataset.wishlistAdd, 1);
      return;
    }
    var wishRemove = target.closest('[data-wishlist-remove]');
    if (wishRemove) {
      toggleWishlist(wishRemove.dataset.wishlistRemove, null);
      return;
    }
    var wishToggle = target.closest('[data-wishlist-toggle]');
    if (wishToggle) {
      toggleWishlist(wishToggle.dataset.wishlistToggle, wishToggle);
      return;
    }

    var addButton = target.closest('[data-add-to-cart]');
    if (addButton) {
      addToCart(addButton.dataset.addToCart, 1);
      return;
    }

    var modalThumb = target.closest('[data-modal-thumb]');
    if (modalThumb) {
      var thumbIndex = parseInt(modalThumb.dataset.modalThumb, 10) || 0;
      state.modalImageIndex = thumbIndex;
      renderModalProduct();
      return;
    }

    var modalQtyButton = target.closest('[data-modal-qty]');
    if (modalQtyButton) {
      var delta = parseInt(modalQtyButton.dataset.modalQty, 10) || 0;
      state.modalQty = Math.max(1, Math.min(MAX_QTY, state.modalQty + delta));
      if (refs.modalQty) refs.modalQty.textContent = String(state.modalQty);
      return;
    }

    if (target.closest('#modalAddToCart') && state.currentProductId) {
      var quantity = state.modalQty;
      var modalProduct = state.currentProductId;
      closeProduct(false);
      addToCart(modalProduct, quantity);
      return;
    }

    if (target.closest('#modalWishlist') && state.currentProductId) {
      toggleWishlist(state.currentProductId, refs.modalWishlist);
      return;
    }

    if (target.closest('#modalMain') && refs.modalMainImg) {
      openZoom(refs.modalMainImg.src, refs.modalMainImg.alt);
      return;
    }

    var zoomSource = target.closest('[data-zoom-src]');
    if (zoomSource) {
      openZoom(zoomSource.dataset.zoomSrc, zoomSource.dataset.zoomAlt || '');
      return;
    }

    var openProductButton = target.closest('[data-open-product]');
    if (openProductButton) {
      openProduct(openProductButton.dataset.openProduct);
      return;
    }

    var authTab = target.closest('[data-auth-tab]');
    if (authTab) {
      switchAuthTab(authTab.dataset.authTab, true);
      return;
    }

    var closed = false;
    if (target.closest('[data-close-cart]')) {
      closeCart(false);
      closed = true;
    }
    if (target.closest('[data-close-wishlist]')) {
      closeWishlist(false);
      closed = true;
    }
    if (target.closest('[data-close-auth]')) {
      closeAuth(false);
      closed = true;
    }
    if (target.closest('[data-close-product]')) {
      closeProduct(false);
      closed = true;
    }
    if (target.closest('[data-close-zoom]')) {
      closeZoom();
      closed = true;
    }

    var opensSomething = target.closest('[data-open-cart], [data-open-wishlist], [data-open-auth], [data-scroll-catalogue]');
    if (closed && !opensSomething) return;

    var openCartButton = target.closest('[data-open-cart]');
    if (openCartButton) {
      openCart();
      return;
    }
    var openWishlistButton = target.closest('[data-open-wishlist]');
    if (openWishlistButton) {
      openWishlist();
      return;
    }
    var openAuthButton = target.closest('[data-open-auth]');
    if (openAuthButton) {
      openAuth('signin');
      return;
    }

    var scrollCatalogue = target.closest('[data-scroll-catalogue]');
    if (scrollCatalogue) {
      window.setTimeout(function () {
        if (document.getElementById('catalogue')) smoothScrollTo('#catalogue');
        else window.location.href = 'index.html#catalogue';
      }, 220);
      return;
    }

    var anchor = target.closest('a[href^="#"]');
    if (anchor) {
      var hash = anchor.getAttribute('href');
      if (!hash || hash === '#') return;
      if (document.querySelector(hash)) {
        event.preventDefault();
        closeMobile(false);
        closeCart(false);
        closeWishlist(false);
        closeAuth(false);
        smoothScrollTo(hash);
      }
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape') {
      if (refs.zoomModal && refs.zoomModal.classList.contains('open')) {
        closeZoom();
      } else if (refs.productModalBackdrop && refs.productModalBackdrop.classList.contains('open')) {
        closeProduct();
      } else if (refs.authModalBackdrop && refs.authModalBackdrop.classList.contains('open')) {
        closeAuth();
      } else if (refs.wishlistDrawer && refs.wishlistDrawer.classList.contains('open')) {
        closeWishlist();
      } else if (refs.cartDrawer && refs.cartDrawer.classList.contains('open')) {
        closeCart();
      } else if (refs.mobileDrawer && refs.mobileDrawer.classList.contains('open')) {
        closeMobile();
      }
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      var card = event.target.closest && event.target.closest('[data-open-product]');
      if (card && card.getAttribute('role') === 'button') {
        event.preventDefault();
        openProduct(card.dataset.openProduct);
      }
    }
  }

  function handleInput(event) {
    var target = event.target;
    if (!target) return;
    if (target.id) clearFieldError(target.id);
    if (target.name === 'paymentMethod') clearFieldError('paymentMethod');
    if (target.id === 'signUpPassword') updatePasswordMeter();
  }

  function handleChange(event) {
    var target = event.target;
    if (!target) return;
    if (target.name === 'paymentMethod') {
      clearFieldError('paymentMethod');
      syncPaymentDetails();
    }
    if (target.id) clearFieldError(target.id);
  }

  function bindEvents() {
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('input', handleInput);
    document.addEventListener('change', handleChange);

    if (refs.contactForm) refs.contactForm.addEventListener('submit', handleContactSubmit);
    if (refs.checkoutForm) {
      refs.checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();
        handleConfirmOrder();
      });
    }
    if (refs.confirmOrderBtn) refs.confirmOrderBtn.addEventListener('click', handleConfirmOrder);
    if (refs.signInForm) refs.signInForm.addEventListener('submit', handleSignIn);
    if (refs.signUpForm) refs.signUpForm.addEventListener('submit', handleSignUp);
    if (refs.signOutBtn) refs.signOutBtn.addEventListener('click', handleSignOut);

    $$('[data-toggle-password]').forEach(function (button) {
      button.addEventListener('click', function () { togglePassword(button); });
    });
    if (refs.signUpPassword) refs.signUpPassword.addEventListener('input', updatePasswordMeter);

    if (refs.mobileMenuBtn) refs.mobileMenuBtn.addEventListener('click', openMobile);
    if (refs.mobileDrawerCloseBtn) refs.mobileDrawerCloseBtn.addEventListener('click', function () { closeMobile(); });
    if (refs.mobileDrawerBackdrop) refs.mobileDrawerBackdrop.addEventListener('click', function () { closeMobile(); });

    if (refs.cartBackdrop) refs.cartBackdrop.addEventListener('click', function () { closeCart(); });
    if (refs.wishlistBackdrop) refs.wishlistBackdrop.addEventListener('click', function () { closeWishlist(); });
    if (refs.authModalBackdrop) {
      refs.authModalBackdrop.addEventListener('click', function (event) {
        if (event.target === refs.authModalBackdrop) closeAuth();
      });
    }
    if (refs.productModalBackdrop) {
      refs.productModalBackdrop.addEventListener('click', function (event) {
        if (event.target === refs.productModalBackdrop) closeProduct();
      });
    }
    if (refs.zoomModal) {
      refs.zoomModal.addEventListener('click', function (event) {
        if (event.target === refs.zoomModal) closeZoom();
      });
    }
    if (refs.zoomClose) refs.zoomClose.addEventListener('click', closeZoom);
    if (refs.backToTop) refs.backToTop.addEventListener('click', function () { smoothScrollTo('#top'); });

    if (refs.heroStageDots) {
      refs.heroStageDots.addEventListener('click', function (event) {
        var dot = event.target.closest('[data-stage-dot]');
        if (dot) scrollToStage(parseInt(dot.dataset.stageDot, 10) || 0);
      });
    }
  }

  function readInitialState() {
    state.lang = readText(STORE_KEYS.lang, 'en') === 'ar' ? 'ar' : 'en';
    state.cart = normalizeCart(readJSON(STORE_KEYS.cart, []));
    state.wishlist = normalizeWishlist(readJSON(STORE_KEYS.wishlist, []));
    var storedAccounts = readJSON(STORE_KEYS.accounts, []);
    state.accounts = (Array.isArray(storedAccounts) ? storedAccounts : []).filter(function (account) {
      return account && account.email && account.passwordHash && account.passwordSalt;
    }).map(function (account) {
      return {
        id: account.id || ('acc_' + randomToken(8)),
        name: account.name || 'Nalam Customer',
        email: String(account.email).trim(),
        phone: account.phone || '',
        governorate: account.governorate || '',
        passwordSalt: account.passwordSalt,
        passwordHash: account.passwordHash,
        createdAt: account.createdAt || new Date().toISOString(),
        lastFloor: account.lastFloor != null ? account.lastFloor : null,
        orders: Array.isArray(account.orders) ? account.orders : []
      };
    });
    state.sessionId = readText(STORE_KEYS.session, '');
    if (!state.accounts.some(function (account) { return account.id === state.sessionId; })) {
      state.sessionId = '';
    }
  }

  function init() {
    readInitialState();
    captureRefs();
    EN_TITLE = document.title;
    var meta = document.querySelector('meta[name="description"]');
    EN_DESCRIPTION = (document.body.dataset.descriptionEn || (meta ? meta.getAttribute('content') : '')) || '';
    AR_TITLE = document.body.dataset.titleAr || AR.page_title;
    AR_DESCRIPTION = document.body.dataset.descriptionAr ||
      'نالام تصمم وتنفذ مطابخ ودريسينج روم وأثاثاً مخصصاً في القاهرة الجديدة بخامات معتمدة وتركيب احترافي وضمان 5 سنوات. توصيل ثابت 5,000 جنيه في القاهرة والجيزة.';
    $$('[data-i18n]').forEach(function (node) {
      node.dataset.i18nEn = node.innerHTML;
    });
    var year = String(new Date().getFullYear());
    if (refs.footerYear) refs.footerYear.textContent = year;

    bindEvents();
    switchAuthTab('signin', false);
    applyLanguage(state.lang, false);
    updateBadges(false, false);
    updateAccountLabel();
    initReveal();
    initScrollEffects();
    prefillCheckout();
    updatePasswordMeter();
    if (currentAccount()) renderProfile();
    if (state.pendingCheckout) showAuthBanner(t('auth_banner'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();





