import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, Smartphone, X, ChevronRight, Home, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { categories } from '../data/mockData';

const Navbar: React.FC = () => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-slate-900 p-2 rounded-lg group-hover:bg-brand-600 transition-colors">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                TechCase<span className="text-brand-600">Pro</span>
              </span>
            </Link>

            {/* Desktop Search */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-slate-400" />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                <Search className="w-6 h-6" />
              </button>
              
              <Link 
                to="/cart" 
                className="relative p-2 text-slate-600 hover:text-brand-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-xs bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex items-center gap-2">
                 <div className="bg-slate-900 p-1.5 rounded-lg">
                   <Smartphone className="w-5 h-5 text-white" />
                 </div>
                 <span className="text-lg font-bold text-slate-900">TechCase<span className="text-brand-600">Pro</span></span>
               </div>
               <button 
                 onClick={() => setIsMenuOpen(false)}
                 className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
               >
                 <X className="w-6 h-6" />
               </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              
              {/* Main Links */}
              <div className="space-y-2 mb-8">
                <Link 
                  to="/" 
                  className="flex items-center gap-3 text-slate-700 font-medium p-3 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" /> Início
                </Link>
                <Link 
                  to="/cart" 
                  className="flex items-center gap-3 text-slate-700 font-medium p-3 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="w-5 h-5" /> Meu Carrinho
                  {cartCount > 0 && <span className="ml-auto bg-brand-100 text-brand-700 text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                </Link>
              </div>

              {/* Categories Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3 flex items-center gap-2">
                  <div className="w-1 h-3 bg-brand-500 rounded-full"></div>
                  Categorias
                </h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/?category=${encodeURIComponent(category.name)}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-sm hover:border-brand-200 hover:shadow-md transition-all group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 group-hover:scale-105 transition-transform" 
                        />
                        <span className="font-medium text-slate-700 group-hover:text-brand-700">{category.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-center text-slate-400">
                © 2024 TechCase Pro.<br/>Qualidade garantida.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;