import React from 'react';
import { Instagram, Facebook, MessageCircle, Send, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Footer: React.FC = () => {
  const { categories } = useData();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">TechCase<span className="text-brand-500">Pro</span></h3>
            <p className="text-sm text-slate-400">
              Sua loja premium de tecnologia. Trazendo o futuro para suas mãos com sofisticação e garantia de qualidade.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-brand-500 transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><MessageCircle className="w-5 h-5" /></a>
              <a href="#" className="hover:text-brand-500 transition-colors"><Send className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trocas e Devoluções</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4">Categorias</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/?category=${encodeURIComponent(category.name)}`}
                    className="hover:text-white transition-colors"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-brand-500" />
                <span>Av. Paulista, 1000 - Bela Vista<br />São Paulo - SP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-500" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                <span>contato@techcasepro.com.br</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} TechCase Pro. Todos os direitos reservados.</span>
          <Link to="/login" className="flex items-center gap-1 hover:text-slate-300 transition-colors">
            <Lock className="w-3 h-3" /> Acesso Restrito
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;