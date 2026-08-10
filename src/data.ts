import { Laptop } from './types';

export const INITIAL_LAPTOPS: Laptop[] = [
  {
    id: 'macbook-pro-m2',
    name: 'MacBook Pro M2 (2022)',
    brand: 'Apple',
    originalPrice: 5400,
    price: 4899,
    ram: '8GB Unified Memory',
    storage: '512GB Super-fast SSD',
    cpu: 'Apple M2 chip with 8-core CPU',
    gpu: 'core GPU-10',
    screen: 'inch Retina-13.3 display with P3 color',
    battery: 'صحة البطارية 98% (65 دورة شحن فقط)',
    conditionOuter: 10,
    conditionScreen: 10,
    conditionScore: 'حالة ممتازة',
    statusBadge: 'الأكثر مبيعاً',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'هذا الجهاز تحديداً يعتبر صيداً ثميناً. تم استخدامه لفترة وجيزة جداً في بيئة مكتبية نظيفة. قمنا بتنظيف المراوح داخلياً وتحديث النظام لآخر إصدار. أضمن جودته شخصياً.'
    },
    featured: true,
    category: 'ultrabook'
  },
  {
    id: 'dell-precision-5570',
    name: 'Dell Precision 5570',
    brand: 'Dell',
    originalPrice: 6200,
    price: 5200,
    ram: '32GB DDR4 RAM',
    storage: '1TB NVMe SSD',
    cpu: 'Intel Core i7-12th Gen',
    gpu: 'NVIDIA RTX A1000 4GB',
    screen: '15.6 inch UHD+ IPS display',
    battery: 'صحة البطارية 94% (حالة ممتازة)',
    conditionOuter: 9,
    conditionScreen: 10,
    conditionScore: 'ممتاز',
    statusBadge: 'أداء احترافي',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'محطة عمل خارقة للتصاميم الهندسية والمونتاج. الهيكل نظيف بنسبة 95% ومثالي لمن يبحث عن قوة الأداء بأقل تكلفة.'
    },
    featured: true,
    category: 'business'
  },
  {
    id: 'hp-spectre-x360',
    name: 'HP Spectre x360 Convertible',
    brand: 'HP',
    originalPrice: 5800,
    price: 4950,
    ram: '16GB RAM',
    storage: '1TB SSD',
    cpu: 'Intel Core i7 11th Gen',
    gpu: 'Intel Iris Xe Graphics',
    screen: 'Touch Screen 4K OLED 13.3"',
    battery: 'صحة البطارية 90% (تدوم طويلاً)',
    conditionOuter: 9,
    conditionScreen: 9,
    conditionScore: 'ممتاز',
    statusBadge: 'شاشة لمس 4K',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'شاشة OLED مذهلة ومثالية لمحبي الرسم وصناع المحتوى. يدعم القلم ويمكن طيه 360 درجة ليعمل كجهاز لوحي.'
    },
    featured: false,
    category: 'students'
  },
  {
    id: 'lenovo-legion-5-pro',
    name: 'Lenovo Legion 5 Pro',
    brand: 'Lenovo',
    originalPrice: 7200,
    price: 6500,
    ram: '32GB RAM',
    storage: '1TB SSD',
    cpu: 'AMD Ryzen 7 5800H',
    gpu: 'NVIDIA RTX 3070 8GB',
    screen: '16 inch QHD 165Hz Display',
    battery: 'صحة البطارية 88% (أداء عالي)',
    conditionOuter: 10,
    conditionScreen: 10,
    conditionScore: 'شبه جديد',
    statusBadge: 'RTX POWERED',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'جهاز ألعاب قوي جداً وبشاشة رائعة بتردد 165 هيرتز. مناسب جداً للمهندسين والمصممين واللاعبين المحترفين.'
    },
    featured: false,
    category: 'gaming'
  },
  {
    id: 'dell-xps-15-9520',
    name: 'Dell XPS 15 9520',
    brand: 'Dell',
    originalPrice: 6800,
    price: 5800,
    ram: '16GB RAM',
    storage: '512GB SSD',
    cpu: 'Intel Core i7-12th Gen',
    gpu: 'NVIDIA GeForce RTX 3050',
    screen: '15.6 inch OLED InfinityEdge',
    battery: 'صحة البطارية 91% (تدوم 8 ساعات)',
    conditionOuter: 10,
    conditionScreen: 10,
    conditionScore: 'ممتاز',
    statusBadge: 'OLED SCREEN',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'أفخم لابتوب ويندوز في السوق حالياً. شاشة بدون حواف إطلاقاً ونظام صوت محيطي مجسم ممتع للغاية.'
    },
    featured: false,
    category: 'business'
  },
  {
    id: 'macbook-air-m2',
    name: 'MacBook Air M2',
    brand: 'Apple',
    originalPrice: 4800,
    price: 4200,
    ram: '8GB RAM',
    storage: '256GB SSD',
    cpu: 'Apple M2 8-Core CPU',
    gpu: '8-core GPU',
    screen: '13.6-inch Liquid Retina Display',
    battery: 'صحة البطارية 99% (32 دورة فقط)',
    conditionOuter: 10,
    conditionScreen: 10,
    conditionScore: 'شبه جديد',
    statusBadge: 'جديد تقريباً',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'جهاز خفيف جداً، بتصميم حديث وبطارية تدوم لـ 18 ساعة عمل متواصلة. أنصح به للطلاب بكثرة.'
    },
    featured: true,
    category: 'students'
  },
  {
    id: 'hp-elitebook-840',
    name: 'HP EliteBook 840 G8',
    brand: 'HP',
    originalPrice: 2200,
    price: 1750,
    ram: '8GB RAM',
    storage: '256GB SSD',
    cpu: 'Intel Core i5 11th Gen',
    gpu: 'Intel UHD Graphics',
    screen: '14" FHD IPS Display',
    battery: 'صحة البطارية 85% (أداء جيد جداً)',
    conditionOuter: 8,
    conditionScreen: 9,
    conditionScore: 'جيد جداً',
    statusBadge: 'عرض محدود',
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'جهاز عملي بهيكل ألومنيوم متين جداً. ممتاز للمهام المكتبية والدراسة اليومية وسعره منافس جداً.'
    },
    featured: false,
    category: 'students'
  },
  {
    id: 'dell-latitude-7420',
    name: 'Dell Latitude 7420',
    brand: 'Dell',
    originalPrice: 2800,
    price: 2100,
    ram: '16GB RAM',
    storage: '256GB SSD',
    cpu: 'Intel Core i7 11th Gen',
    gpu: 'Intel Iris Xe',
    screen: '14" FHD Display',
    battery: 'صحة البطارية 89% (حالة جيدة)',
    conditionOuter: 9,
    conditionScreen: 9,
    conditionScore: 'ممتاز',
    statusBadge: 'خفيف وعملي',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'لابتوب مخصص للأعمال والمدراء. خفيف للغاية، مزود بـ 16 جيجابايت رام لتعدد المهام بسلاسة فائقة.'
    },
    featured: false,
    category: 'business'
  },
  {
    id: 'surface-laptop-4',
    name: 'Microsoft Surface Laptop 4',
    brand: 'Microsoft',
    originalPrice: 3400,
    price: 2850,
    ram: '8GB RAM',
    storage: '256GB SSD',
    cpu: 'AMD Ryzen 5',
    gpu: 'AMD Radeon Graphics',
    screen: '13.5" PixelSense Touch Screen',
    battery: 'صحة البطارية 92% (شحن سريع)',
    conditionOuter: 9,
    conditionScreen: 10,
    conditionScore: 'ممتاز',
    statusBadge: 'TOUCH SCREEN',
    image: 'https://images.unsplash.com/photo-1585241936939-be4099dec914?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585241936939-be4099dec914?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'شاشة بالغة الوضوح مع نسبة أبعاد 3:2 الممتازة لتصفح الويب وقراءة المستندات. الملمس الخارجي ناعم وفاخر.'
    },
    featured: false,
    category: 'students'
  },
  {
    id: 'thinkpad-x1-carbon',
    name: 'Lenovo ThinkPad X1 Carbon G9',
    brand: 'Lenovo',
    originalPrice: 4900,
    price: 3900,
    ram: '16GB RAM',
    storage: '1TB SSD',
    cpu: 'Intel Core i7 12th Gen',
    gpu: 'Intel Iris Xe Graphics',
    screen: '14" FHD IPS Anti-glare',
    battery: 'صحة البطارية 87% (سريعة الشحن)',
    conditionOuter: 9,
    conditionScreen: 9,
    conditionScore: 'جيد جداً',
    statusBadge: '1TB SSD ULTRA',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'
    ],
    sellerNote: {
      author: 'م. خالد العمري',
      role: 'كبير الفنيين المعتمدين',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      text: 'هيكل من ألياف الكربون القوي للغاية. اللابتوب المفضل للمبرمجين بفضل لوحة المفاتيح الأسطورية المريحة للغاية.'
    },
    featured: true,
    category: 'ultrabook'
  }
];

export const ACCESSORIES: Laptop[] = [
  {
    id: 'premium-accessory-bag',
    name: 'حقيبة لابتوب جلدية فاخرة + ماوس لاسلكي مريح للغاية',
    brand: 'Lenovo', // Using any valid brand from types
    originalPrice: 450,
    price: 350,
    ram: 'مقاوم للماء والرطوبة',
    storage: 'جيوب متعددة للتنظيم',
    cpu: 'حزمة الملحقات الممتازة المعتمدة',
    conditionOuter: 10,
    conditionScreen: 10,
    conditionScore: 'جديد كلياً',
    statusBadge: 'حزمة توفيرية',
    image: 'https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1625766763788-95dcce9bf5ac?auto=format&fit=crop&q=80&w=800'],
    category: 'students'
  }
];

export const SIMILAR_LAPTOPS: Laptop[] = [
  {
    id: 'macbook-air-m1',
    name: 'MacBook Air M1 (2020)',
    brand: 'Apple',
    originalPrice: 3800,
    price: 3199,
    ram: '8GB RAM',
    storage: '256GB SSD',
    cpu: 'Apple M1 Chip',
    conditionOuter: 9,
    conditionScreen: 10,
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800'],
    category: 'students'
  },
  {
    id: 'dell-xps-13-plus',
    name: 'Dell XPS 13 Plus 9320',
    brand: 'Dell',
    originalPrice: 6200,
    price: 5450,
    ram: '16GB RAM',
    storage: '1TB SSD',
    cpu: 'Intel Core i7 12th Gen',
    conditionOuter: 10,
    conditionScreen: 10,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=800'],
    category: 'ultrabook'
  },
  {
    id: 'surface-laptop-5',
    name: 'Surface Laptop 5',
    brand: 'Microsoft',
    originalPrice: 4900,
    price: 4200,
    ram: '16GB RAM',
    storage: '512GB SSD',
    cpu: 'Intel Core i5 12th Gen',
    conditionOuter: 9,
    conditionScreen: 9,
    image: 'https://images.unsplash.com/photo-1585241936939-be4099dec914?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1585241936939-be4099dec914?auto=format&fit=crop&q=80&w=800'],
    category: 'students'
  },
  {
    id: 'lenovo-thinkpad-x1',
    name: 'Lenovo ThinkPad X1 Carbon Gen 9',
    brand: 'Lenovo',
    originalPrice: 4500,
    price: 3890,
    ram: '16GB RAM',
    storage: '512GB SSD',
    cpu: 'Intel Core i7 11th Gen',
    conditionOuter: 9,
    conditionScreen: 9,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800'],
    category: 'business'
  }
];
