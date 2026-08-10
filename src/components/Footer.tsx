import React from 'react';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';

interface FooterProps {
  onNavigateCategory: (category: 'students' | 'business' | 'gaming' | null) => void;
  onNavigateTab: (tab: 'home' | 'profile' | 'orders') => void;
}

export default function Footer({ onNavigateCategory, onNavigateTab }: FooterProps) {
  return (
    <footer className="bg-[#0b0e17] text-slate-400 py-16 border-t border-slate-900" dir="rtl" id="app-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white">
                <svg className="w-6 h-6" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 15L45 55V90H55V55L80 15" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span className="font-sans text-lg font-bold text-white block">Y TECK</span>
                <span className="text-slate-500 text-[10px] block -mt-1">LAPTOP STORE</span>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              منصتكم الموثوقة لأجهزة اللابتوب المجددة والمستعملة والمستوردة بأعلى معايير الجودة العالمية مع ضمان حقيقي لمدة عام كامل.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">روابط سريعة</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-white transition-colors cursor-pointer">
                  عن واي تيك
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-white transition-colors cursor-pointer">
                  سياسة الضمان والاسترجاع
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-white transition-colors cursor-pointer">
                  الشحن والتوصيل المجاني
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('profile')} className="hover:text-white transition-colors cursor-pointer">
                  الملف الشخصي وحسابي
                </button>
              </li>
            </ul>
          </div>

          {/* Shop categories */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">تسوق حسب الفئة</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigateCategory('gaming')} className="hover:text-white transition-colors cursor-pointer">
                  أجهزة الألعاب القوية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('business')} className="hover:text-white transition-colors cursor-pointer">
                  أجهزة الأعمال والمهندسين
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory('students')} className="hover:text-white transition-colors cursor-pointer">
                  أجهزة للطلاب والمعلمين
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateCategory(null)} className="hover:text-white transition-colors cursor-pointer">
                  ملحقات وحزم اللابتوب
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wide">تواصل معنا</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5 justify-end">
                <a href="https://wa.me/967776731078" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  +967 776731078
                </a>
                <Phone className="w-4 h-4 text-slate-500" />
              </li>
              <li className="flex items-center gap-2.5 justify-end">
                <a href="https://instagram.com/y._e_m" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  @y._e_m
                </a>
                <Instagram className="w-4 h-4 text-slate-500" />
              </li>
            </ul>
          </div>

        </div>

        {/* Separator & copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600 text-center">
          <div>
            <span>© ٢٠٢٤ Y TECK. جميع الحقوق محفوظة.</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:text-slate-500 cursor-pointer">الشروط والأحكام</span>
            <span>•</span>
            <span className="hover:text-slate-500 cursor-pointer">سياسة الخصوصية</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
