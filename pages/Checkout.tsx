import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, Truck, Store, User, Smartphone, Mail, CreditCard, Lock, 
  QrCode, Banknote, Bitcoin, Wallet, FileText
} from 'lucide-react';
import { OrderForm } from '../types';

const Checkout: React.FC = () => {
  const { cart, cartTotal } = useCart(); // Removed clearCart from destructuring here as it's no longer used
  const { recordSale, paymentSettings } = useData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<OrderForm & { cpf: string }>({
    fullName: '',
    email: '',
    whatsapp: '',
    cpf: '',
    deliveryMethod: 'pickup',
    paymentMethod: '',
    zipCode: '',
    street: '',
    number: '',
    neighborhood: '',
    complement: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentSelect = (method: string) => {
    setFormData((prev) => ({ ...prev, paymentMethod: method }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validação Básica
    if (!formData.fullName || !formData.email || !formData.whatsapp) {
      alert("Por favor, preencha os dados de contato obrigatórios.");
      setLoading(false);
      return;
    }

    if (formData.deliveryMethod === 'delivery') {
      if (!formData.zipCode || !formData.street || !formData.number || !formData.neighborhood) {
         alert("Por favor, preencha o endereço completo para entrega.");
         setLoading(false);
         return;
      }
    }

    if (!formData.paymentMethod) {
      alert("Por favor, selecione uma forma de pagamento.");
      setLoading(false);
      return;
    }

    // Simulação de Processamento e Registro da Venda
    setTimeout(() => {
      const sale = recordSale({
        sellerId: undefined, // Venda online (sem vendedor logado)
        sellerName: 'Loja Online',
        total: cartTotal,
        items: cart,
        paymentMethod: formData.paymentMethod,
        customerName: formData.fullName,
        customerCpf: formData.cpf, // Passando o CPF capturado
        date: new Date().toISOString()
      });

      // Importante: Não limpamos o carrinho aqui para evitar que a verificação de "carrinho vazio"
      // redirecione o usuário para a home antes da navegação para o sucesso ocorrer.
      // O carrinho será limpo na página de Sucesso.
      
      navigate('/success', { state: { sale } });
    }, 1500);
  };

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  // Filtra métodos de pagamento ativos no Admin
  const activePaymentMethods = paymentSettings.filter(p => p.active);

  const getPaymentIcon = (id: string) => {
    switch(id) {
      case 'pix': return QrCode;
      case 'cash': return Banknote;
      case 'crypto': return Bitcoin;
      default: return CreditCard;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Finalizar Pedido</h1>
      
      <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-600" />
              Dados do Cliente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder="Ex: João da Silva"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CPF (Opcional)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="000.000.000-00"
                  />
                  <p className="text-xs text-slate-500 mt-1">Para emissão na nota fiscal</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone / WhatsApp</label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="joao@email.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-brand-600" />
              Forma de Entrega
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className={`
                relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all
                ${formData.deliveryMethod === 'pickup' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}
              `}>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="pickup"
                  checked={formData.deliveryMethod === 'pickup'}
                  onChange={() => setFormData(prev => ({ ...prev, deliveryMethod: 'pickup' }))}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
                  <Store className="w-5 h-5" /> Retirar na Loja
                </div>
                <p className="text-sm text-slate-500">Av. Paulista, 1000 - SP. Disponível em 2 horas.</p>
              </label>

              <label className={`
                relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all
                ${formData.deliveryMethod === 'delivery' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}
              `}>
                <input
                  type="radio"
                  name="deliveryMethod"
                  value="delivery"
                  checked={formData.deliveryMethod === 'delivery'}
                  onChange={() => setFormData(prev => ({ ...prev, deliveryMethod: 'delivery' }))}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
                  <Truck className="w-5 h-5" /> Delivery
                </div>
                <p className="text-sm text-slate-500">Receba em casa via Transportadora ou Correios.</p>
              </label>
            </div>

            {/* Delivery Fields */}
            {formData.deliveryMethod === 'delivery' ? (
              <div className="space-y-4 animate-fadeIn">
                 <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">CEP</label>
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" placeholder="00000-000" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Rua</label>
                      <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" />
                    </div>
                 </div>
                 <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Número</label>
                      <input type="text" name="number" value={formData.number} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Bairro</label>
                      <input type="text" name="neighborhood" value={formData.neighborhood} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" />
                    </div>
                     <div className="col-span-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Comp.</label>
                      <input type="text" name="complement" value={formData.complement} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 outline-none" />
                    </div>
                 </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-lg flex items-start gap-3">
                 <MapPin className="w-5 h-5 text-brand-600 mt-0.5" />
                 <div>
                   <h4 className="font-semibold text-slate-900">TechCase Pro Store</h4>
                   <p className="text-sm text-slate-600">Av. Paulista, 1000, Sala 42<br/>Bela Vista, São Paulo - SP</p>
                   <div className="mt-2 w-full h-32 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                      [Mapa Estático Simulado]
                   </div>
                 </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-brand-600" />
              Forma de Pagamento
            </h2>
            <div className="space-y-3">
              {activePaymentMethods.length === 0 ? (
                <p className="text-red-500">Nenhum método de pagamento disponível no momento.</p>
              ) : (
                activePaymentMethods.map((option) => {
                  const Icon = getPaymentIcon(option.id);
                  return (
                    <label 
                      key={option.id}
                      className={`
                        relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all
                        ${formData.paymentMethod === option.name 
                          ? 'border-brand-500 bg-brand-50' 
                          : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}
                      `}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={option.name}
                        checked={formData.paymentMethod === option.name}
                        onChange={() => handlePaymentSelect(option.name)}
                        className="sr-only"
                      />
                      <div className={`p-2 rounded-lg mr-4 ${formData.paymentMethod === option.name ? 'bg-brand-200 text-brand-700' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="block font-semibold text-slate-900">{option.name}</span>
                        <span className="text-sm text-slate-500 capitalize">{option.type}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === option.name ? 'border-brand-500' : 'border-slate-300'}`}>
                        {formData.paymentMethod === option.name && (
                          <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-4 mt-8 lg:mt-0">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Resumo do Pedido</h2>
            
            <ul className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.title}</p>
                    <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    R$ {(item.price * item.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 0})}
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between font-bold text-xl text-slate-900">
                <span>Total</span>
                <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                'Processando...'
              ) : (
                <>
                  <CreditCard className="w-5 h-5" /> Confirmar Pagamento
                </>
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
               <Lock className="w-3 h-3" /> Ambiente criptografado
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;