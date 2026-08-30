import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Laptop, 
  Monitor, 
  Tablet, 
  Watch, 
  Headphones, 
  Layers,
  Sparkles,
  Gamepad2,
  Volume2
} from 'lucide-react';
import { CategoryType, Product } from '../../types';

interface CategoryChipsProps {
  categories: CategoryType[];
  selectedCategory: CategoryType | 'Todos';
  onSelectCategory: (category: CategoryType | 'Todos') => void;
  products: Product[];
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Todos': <Layers size={16} className="text-cyan-400" />,
  'iPhone': <Smartphone size={16} className="text-cyan-400" />,
  'Mac': <Monitor size={16} className="text-purple-400" />,
  'Notebook': <Laptop size={16} className="text-blue-400" />,
  'iPad': <Tablet size={16} className="text-pink-400" />,
  'Apple Watch': <Watch size={16} className="text-emerald-400" />,
  'Accesorios': <Headphones size={16} className="text-amber-400" />,
  'Android': <Sparkles size={16} className="text-green-400" />,
  'Consolas': <Gamepad2 size={16} className="text-indigo-400" />,
  'Parlantes': <Volume2 size={16} className="text-orange-400" />
};

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products
}) => {
  const getCount = (cat: CategoryType | 'Todos') => {
    if (cat === 'Todos') return products.length;
    return products.filter((p) => p.category === cat).length;
  };

  // Filtrar para mostrar ÚNICAMENTE las categorías que tienen al menos 1 producto cargado
  const activeCategories: (CategoryType | 'Todos')[] = [
    'Todos',
    ...categories.filter((cat) => getCount(cat) > 0)
  ];

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-4 sm:px-6">
      <div className="flex items-center gap-2.5 min-w-max">
        {activeCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = getCount(cat);

          return (
            <motion.button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              whileTap={{ scale: 0.94 }}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                isSelected
                  ? 'liquid-pill-active text-white font-bold'
                  : 'liquid-pill text-slate-300 hover:text-white hover:border-white/25'
              }`}
            >
              {CATEGORY_ICONS[cat] || <Layers size={16} className="text-cyan-400" />}
              <span>{cat}</span>

              {/* Conteo de productos */}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-cyan-400/20 text-cyan-200 border border-cyan-400/30'
                    : 'bg-white/5 text-slate-400'
                }`}
              >
                {count}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
