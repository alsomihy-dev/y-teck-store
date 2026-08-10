import React from 'react';

interface CategoryCard {
  id: 'students' | 'business' | 'gaming';
  title: string;
  subtitle: string;
  image: string;
}

interface CategoriesProps {
  onSelectCategory: (category: 'students' | 'business' | 'gaming' | null) => void;
  selectedCategory: 'students' | 'business' | 'gaming' | null;
}

const CATEGORIES_DATA: CategoryCard[] = [
  {
    id: 'students',
    title: 'للطلاب',
    subtitle: 'التوازن المثالي بين الأداء والقيمة لبداية دراسية قوية',
    image: 'https://images.unsplash.com/photo-1496181130204-755241544e35?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'business',
    title: 'للأعمال',
    subtitle: 'نحافة، خفة، وبطارية تدوم طويلاً لإنجاز مهامك في أي مكان',
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'gaming',
    title: 'أجهزة الألعاب',
    subtitle: 'قوة فائقة ومعالجات رسومية متطورة لتجربة ألعاب غامرة',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&q=80&w=600'
  }
];

export default function Categories({ onSelectCategory, selectedCategory }: CategoriesProps) {
  return (
    <div className="hidden md:block py-16 bg-white" dir="rtl" id="categories-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">الفئات الأكثر طلباً</h2>
            <p className="text-slate-500 text-sm mt-1">تصفح لابتوبات مخصصة حسب طبيعة استخدامك واحتياجك المالي.</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => onSelectCategory(null)}
              className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              عرض الكل &larr;
            </button>
          )}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORIES_DATA.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => onSelectCategory(isSelected ? null : category.id)}
                className={`group relative h-[250px] w-full rounded-2xl overflow-hidden text-right border-2 transition-all duration-300 text-slate-100 cursor-pointer ${
                  isSelected 
                    ? 'border-slate-950 ring-4 ring-slate-100' 
                    : 'border-transparent shadow-md hover:shadow-xl'
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0 bg-slate-950">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col justify-end h-full">
                  <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-1 rounded-full w-max mb-2">
                    الكل مفحوص ومعتمد
                  </span>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">
                    {category.title}
                  </h3>
                  <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                    {category.subtitle}
                  </p>
                </div>

                {/* Active marker indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1 rounded-full border border-white/20">
                    محدد حالياً
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
