import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Laptop } from '../types';

interface ProductCardProps {
  key?: string | number;
  laptop: Laptop;
  onSelect: (laptop: Laptop) => void;
  onAddToCart: (laptop: Laptop, e?: React.MouseEvent) => void;
}

export default function ProductCard({ laptop, onSelect, onAddToCart }: ProductCardProps) {
  const [liked, setLiked] = React.useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div
      onClick={() => onSelect(laptop)}
      className="bg-white border border-indigo-900/20 rounded-2xl overflow-hidden cursor-pointer group flex flex-col h-full transition-all duration-300 hover:border-indigo-900/40 hover:shadow-xl hover:-translate-y-1 relative"
      dir="rtl"
      id={`product-card-${laptop.id}`}
    >
      {/* Product Image Area with Tinted Background */}
      <div className="bg-slate-50 p-6 flex items-center justify-center relative min-h-[220px]">
        
        {/* Status Badge */}
        {laptop.statusBadge && (
          <span className="absolute top-4 right-4 bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full border border-slate-800 shadow-sm z-10">
            {laptop.statusBadge}
          </span>
        )}

        {/* Favorite Icon */}
        <button 
          onClick={handleLike}
          className={`absolute top-4 left-4 p-2 rounded-full border bg-white/80 backdrop-blur-sm shadow-sm transition-all hover:scale-105 z-10 cursor-pointer ${
            liked ? 'text-red-500 border-red-200' : 'text-slate-400 border-slate-200'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Laptop Render */}
        <img
          src={laptop.image}
          alt={laptop.name}
          className="w-full h-36 object-contain transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Product Details info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <span className="text-xs font-bold text-slate-400 block tracking-wider uppercase mb-1">
            {laptop.brand}
          </span>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors line-clamp-1">
            {laptop.name}
          </h3>

          {/* Chips specs */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-1 rounded-full">
              {laptop.ram}
            </span>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-1 rounded-full">
              {laptop.storage}
            </span>
            {laptop.gpu && (
              <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-1 rounded-full">
                {laptop.gpu.split(' ').slice(-2).join(' ')}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Button Row */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">السعر المخفض</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-slate-900">
                {laptop.price.toLocaleString('en-US')}
              </span>
              <span className="text-xs font-semibold text-slate-900">{laptop.currency || 'ر.س'}</span>
              {laptop.originalPrice > laptop.price && (
                <span className="text-xs text-slate-400 line-through mr-1.5">
                  {(laptop.originalPrice).toLocaleString('en-US')} {laptop.currency || 'ر.س'}
                </span>
              )}
            </div>
          </div>

          {/* Black circle basket button */}
          <button
            onClick={(e) => onAddToCart(laptop, e)}
            className="w-10 h-10 bg-slate-950 hover:bg-slate-800 text-white rounded-full flex items-center justify-center shadow transition-all hover:scale-105 cursor-pointer"
            title="إضافة إلى السلة"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
