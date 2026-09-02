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
  aesthetic?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Todos': <Layers size={16} />,
  'iPhone': <Smartphone size={16} />,
  'Mac': <Monitor size={16} />,
  'Notebook': <Laptop size={16} />,
  'iPad': <Tablet size={16} />,
  'Apple Watch': <Watch size={16} />,
  'Accesorios': <Headphones size={16} />,
  'Android': <Sparkles size={16} />,
  'Consolas': <Gamepad2 size={16} />,
  'Parlantes': <Volume2 size={16} />
};

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  products,
  aesthetic
}) => {
  const isLeather = aesthetic === 'leather-luxury';

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
    <div className="w-full overflow-x-auto no-scrollbar py-2 px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-max">
        {activeCategories.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = getCount(cat);

          return (
            <motion.button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              whileTap={{ scale: 0.95 }}
              className={`relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 ${
                isLeather
                  ? isSelected
                    ? 'bg-white text-black font-extrabold shadow-md border border-white'
                    : 'bg-[#141418] text-zinc-300 border border-zinc-800 hover:border-zinc-600 hover:text-white'
                  : isSelected
                    ? 'liquid-pill-active text-white font-bold'
                    : 'liquid-pill text-slate-300 hover:text-white hover:border-white/25'
              }`}
            >
              <span className={isLeather ? (isSelected ? 'text-black' : 'text-zinc-400') : 'text-cyan-400'}>
                {CATEGORY_ICONS[cat] || <Layers size={16} />}
              </span>
              <span>{cat}</span>

              {/* Conteo de productos */}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isLeather
                    ? isSelected
                      ? 'bg-black/10 text-black font-bold'
                      : 'bg-black/30 text-zinc-500'
                    : isSelected
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
