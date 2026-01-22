import React from 'react';
import { useData } from '../context/DataContext'; // Changed from import mockData
import ProductCard from '../components/ProductCard';
import { ArrowRight, Star, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const Home: React.FC = () => {
  const { products, categories } = useData(); // Consume data from context
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category');
  
  const featuredProducts = products.slice(0, 4);
  
  // Filter products based on URL search param
  const filteredProducts = currentCategory
    ? products.filter(p => p.category === currentCategory)
    : products;

  const handleCategoryClick = (categoryName: string) => {
    if (currentCategory === categoryName) {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryName });
      // Small timeout to allow state update before scrolling
      setTimeout(() => {
        document.getElementById('main-product-grid')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10"></div>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1556656793-02715d8dd6f8?q=80&w=2000&auto=format&fit=crop" 
            alt="Hero Background" 
            crossOrigin="anonymous"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Tecnologia Premium <br/>
              <span className="text-brand-500">Ao Seu Alcance</span>
            </h1>
            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Descubra os lançamentos mais recentes em smartphones, smartwatches e acessórios de alta performance. Qualidade garantida e design sofisticado.
            </p>
            <Link 
              to="/#products"
              onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-brand-50 transition-colors"
            >
              Ver Produtos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
          <div className="w-1 h-8 bg-brand-500 rounded-full"></div>
          Navegue por Categorias
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => handleCategoryClick(cat.name)}
              className={`group cursor-pointer rounded-2xl transition-all duration-300 ${
                currentCategory === cat.name 
                  ? 'ring-2 ring-brand-500 ring-offset-2 scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
                <div className={`absolute inset-0 transition-colors z-10 ${
                  currentCategory === cat.name ? 'bg-brand-900/10' : 'bg-slate-900/10 group-hover:bg-slate-900/0'
                }`}></div>
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover transition-transform duration-500"
                />
              </div>
              <h3 className={`text-center font-semibold transition-colors ${
                currentCategory === cat.name ? 'text-brand-600' : 'text-slate-900 group-hover:text-brand-600'
              }`}>
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products (Always Visible) */}
      {!currentCategory && (
        <section id="products" className="bg-slate-50 py-16 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-6 h-6 text-brand-500 fill-brand-500" />
                  Destaques da Semana
                </h2>
                <p className="text-slate-500 mt-2">Os produtos mais desejados pelos nossos clientes.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Product Grid (Filtered or All) */}
      <section id="main-product-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-slate-900">
              {currentCategory ? `Produtos: ${currentCategory}` : 'Todos os Produtos'}
            </h2>
            
            {currentCategory && (
              <button
                onClick={() => setSearchParams({})}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
              >
                Limpar Filtro <X className="w-4 h-4" />
              </button>
            )}
         </div>

         {filteredProducts.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={`all-${product.id}`} product={product} />
              ))}
           </div>
         ) : (
           <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
             <p className="text-slate-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
             <button 
               onClick={() => setSearchParams({})}
               className="mt-4 text-brand-600 font-medium hover:underline"
             >
               Ver todos os produtos
             </button>
           </div>
         )}
      </section>
    </div>
  );
};

export default Home;