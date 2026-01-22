import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { LogOut, ShoppingCart, Plus, Minus, Trash2, CheckCircle, CreditCard, Printer, RotateCcw, X } from 'lucide-react';
import { CartItem, Product, Sale } from '../types';

const SellerPOS: React.FC = () => {
  const { user, logout } = useAuth();
  const { products, recordSale, paymentSettings } = useData();
  const navigate = useNavigate();
  
  const [posCart, setPosCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('');
  
  // Post-Sale State
  const [lastSale, setLastSale] = useState<Sale | null>(null);

  if (!user || user.role !== 'seller') {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const addToCart = (product: Product) => {
    setPosCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setPosCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(1, item.quantity + delta) };
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setPosCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = posCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const activePaymentMethods = paymentSettings.filter(p => p.active);

  const handleOpenCheckout = () => {
    if (posCart.length === 0) return;
    if (activePaymentMethods.length > 0) {
      setSelectedPayment(activePaymentMethods[0].name);
    }
    setIsCheckoutOpen(true);
  };

  const handleFinalizeSale = () => {
    if (!selectedPayment) {
      alert("Selecione um método de pagamento");
      return;
    }

    const sale = recordSale({
      sellerId: user.id,
      sellerName: user.name,
      total: cartTotal,
      items: posCart,
      paymentMethod: selectedPayment,
      customerName: customerName || 'Consumidor Final',
      customerCpf: customerCpf || ''
    });

    setLastSale(sale);
    setIsCheckoutOpen(false);
    // Não limpamos o posCart aqui, pois precisamos dele para a nota fiscal, limpamos ao iniciar nova venda
  };

  const handleNewSale = () => {
    setPosCart([]);
    setLastSale(null);
    setCustomerName('');
    setCustomerCpf('');
    setSearchTerm('');
  };

  const handlePrint = () => {
    window.print();
  };

  // If sale completed, show Invoice/Receipt View
  if (lastSale) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md overflow-hidden print:shadow-none print:w-full print:max-w-none">
          
          {/* Print-only styles handled by media query or classes */}
          <div id="invoice-area" className="p-8">
            <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
               <h2 className="text-2xl font-bold uppercase tracking-widest text-slate-900">TechCase Pro</h2>
               <p className="text-xs text-slate-500">Av. Paulista, 1000 - São Paulo, SP</p>
               <p className="text-xs text-slate-500">CNPJ: 00.000.000/0001-00</p>
            </div>

            <div className="mb-4 text-sm">
               <p className="flex justify-between"><span>Data:</span> <span>{new Date(lastSale.date).toLocaleString('pt-BR')}</span></p>
               <p className="flex justify-between"><span>Venda Nº:</span> <span className="font-mono">{lastSale.id}</span></p>
               <p className="flex justify-between"><span>Vendedor:</span> <span>{lastSale.sellerName}</span></p>
            </div>

            <div className="mb-4 text-sm border-b border-dashed border-slate-300 pb-4">
               <p className="font-bold mb-1">Cliente</p>
               <p>Nome: {lastSale.customerName}</p>
               {lastSale.customerCpf && <p>CPF: {lastSale.customerCpf}</p>}
            </div>

            <table className="w-full text-sm mb-4">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="pb-1">Qtd</th>
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {lastSale.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1 align-top">{item.quantity}x</td>
                    <td className="py-1 align-top">{item.title}</td>
                    <td className="py-1 align-top text-right">{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-dashed border-slate-300 pt-4 mb-8">
               <div className="flex justify-between text-lg font-bold">
                 <span>TOTAL</span>
                 <span>R$ {lastSale.total.toFixed(2)}</span>
               </div>
               <p className="text-right text-sm text-slate-500 mt-1">Pagamento: {lastSale.paymentMethod}</p>
            </div>

            <div className="text-center text-xs text-slate-400">
              <p>Obrigado pela preferência!</p>
              <p>Trocas somente com este cupom em até 7 dias.</p>
            </div>
          </div>

          {/* Action Buttons (Hidden on Print) */}
          <div className="bg-slate-50 p-6 flex flex-col gap-3 print:hidden">
            <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors">
              <Printer className="w-5 h-5" /> Imprimir Cupom
            </button>
            <button onClick={handleNewSale} className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">
              <RotateCcw className="w-5 h-5" /> Nova Venda
            </button>
          </div>

        </div>
        
        {/* Style for print specifically to hide everything else */}
        <style>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-area, #invoice-area * {
              visibility: visible;
            }
            #invoice-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
            }
            @page {
              margin: 0;
              size: auto; 
            }
          }
        `}</style>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <div>
          <h1 className="text-xl font-bold">PDV - TechCase<span className="text-brand-500">Pro</span></h1>
          <p className="text-xs text-slate-400">Vendedor: {user.name}</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-red-400">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Product Catalog */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="mb-6">
            <input 
              type="text" 
              placeholder="Buscar produtos..." 
              className="w-full p-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="h-32 bg-slate-100">
                   <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.title}</h3>
                  <div className="mt-auto flex justify-between items-center">
                    <span className="font-bold">R$ {product.price.toFixed(2)}</span>
                    <button onClick={() => addToCart(product)} className="bg-brand-600 text-white p-1.5 rounded-lg hover:bg-brand-700">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="w-full md:w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
             <h2 className="font-bold text-slate-800 flex items-center gap-2">
               <ShoppingCart className="w-5 h-5 text-brand-600" /> Cesta de Compras
             </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {posCart.length === 0 ? (
              <div className="text-center text-slate-400 mt-12">
                 <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-20" />
                 <p>Cesta vazia</p>
              </div>
            ) : (
              posCart.map(item => (
                <div key={item.id} className="flex gap-3 items-center">
                   <img src={item.image} className="w-12 h-12 rounded object-cover bg-slate-100" />
                   <div className="flex-1">
                     <p className="text-sm font-medium line-clamp-1">{item.title}</p>
                     <p className="text-xs text-brand-600 font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Minus className="w-3 h-3" /></button>
                     <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                     <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200"><Plus className="w-3 h-3" /></button>
                     <button onClick={() => removeItem(item.id)} className="ml-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
             <div className="flex justify-between items-center mb-4">
               <span className="text-slate-600">Total</span>
               <span className="text-2xl font-bold text-slate-900">R$ {cartTotal.toFixed(2)}</span>
             </div>
             
             <button 
               onClick={handleOpenCheckout}
               disabled={posCart.length === 0}
               className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
             >
               <CreditCard className="w-5 h-5" /> Ir para Pagamento
             </button>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
              <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Finalizar Venda</h2>
              
              <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Cliente (Opcional)</label>
                   <input 
                     type="text" 
                     className="w-full p-2 border rounded-lg" 
                     placeholder="Consumidor Final"
                     value={customerName}
                     onChange={e => setCustomerName(e.target.value)}
                   />
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">CPF (Opcional)</label>
                   <input 
                     type="text" 
                     className="w-full p-2 border rounded-lg" 
                     placeholder="000.000.000-00"
                     value={customerCpf}
                     onChange={e => setCustomerCpf(e.target.value)}
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">Forma de Pagamento</label>
                   {activePaymentMethods.length === 0 ? (
                     <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                       Nenhum método de pagamento ativo. Contate o administrador.
                     </div>
                   ) : (
                     <div className="grid grid-cols-2 gap-2">
                       {activePaymentMethods.map(method => (
                         <button
                           key={method.id}
                           onClick={() => setSelectedPayment(method.name)}
                           className={`p-3 rounded-lg border text-sm font-medium transition-all ${selectedPayment === method.name ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}
                         >
                           {method.name}
                         </button>
                       ))}
                     </div>
                   )}
                 </div>

                 <div className="border-t pt-4 mt-6">
                   <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-medium">Total a Pagar</span>
                      <span className="text-2xl font-bold text-slate-900">R$ {cartTotal.toFixed(2)}</span>
                   </div>
                   
                   <button
                     onClick={handleFinalizeSale}
                     className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                   >
                     <CheckCircle className="w-5 h-5" /> Confirmar Venda
                   </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SellerPOS;