import React, { useEffect } from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Printer, Share2 } from 'lucide-react';
import { Sale } from '../types';
import { useCart } from '../context/CartContext';

const Success: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const state = location.state as { sale: Sale } | null;

  useEffect(() => {
    // Limpa o carrinho ao montar o componente para garantir que o fluxo de checkout foi concluído
    if (state?.sale) {
      clearCart();
    }
  }, [state, clearCart]);

  if (!state || !state.sale) {
    return <Navigate to="/" />;
  }

  const { sale } = state;

  // Função para imprimir e redirecionar ao fechar a janela de impressão
  const handlePrint = () => {
    const handleAfterPrint = () => {
      // Remove o listener para evitar vazamento de memória e múltiplas chamadas
      window.removeEventListener('afterprint', handleAfterPrint);
      // Redireciona para a loja
      navigate('/');
    };

    // Adiciona o listener antes de chamar o print
    window.addEventListener('afterprint', handleAfterPrint);
    
    // Pequeno delay para garantir que o browser processe o listener
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Função para compartilhar e redirecionar
  const handleShare = async () => {
    const shareText = `*Comprovante de Compra - TechCase Pro*\n\nPedido: #${sale.id}\nCliente: ${sale.customerName}\nTotal: R$ ${sale.total.toFixed(2)}\nData: ${new Date(sale.date).toLocaleString('pt-BR')}`;
    const storeUrl = window.location.origin; // URL da loja

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Compra TechCase Pro',
          text: shareText,
          url: storeUrl,
        });
        // Sucesso no compartilhamento
      } catch (error) {
        console.log('Compartilhamento fechado ou erro:', error);
      } finally {
        // Retorna para a loja independente do resultado
        navigate('/');
      }
    } else {
      // Fallback para navegadores sem suporte a Web Share API (Desktop)
      try {
        await navigator.clipboard.writeText(`${shareText}\n${storeUrl}`);
        alert("Detalhes do pedido copiados para a área de transferência!");
      } catch (err) {
        alert("Redirecionando para a loja...");
      } finally {
        navigate('/');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 bg-slate-50">
      
      {/* Success Message Header */}
      <div className="max-w-md w-full text-center mb-8 print:hidden">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pedido Confirmado!</h1>
        <p className="text-slate-600">
          Obrigado, {sale.customerName}! Seu pagamento foi processado com sucesso.
        </p>
      </div>

      {/* Printable Receipt Card */}
      <div 
        id="customer-receipt" 
        className="bg-white w-full max-w-sm mx-auto p-8 rounded-2xl shadow-xl border border-slate-100 print:shadow-none print:border-none print:w-full print:max-w-none"
      >
        <div className="text-center border-b border-dashed border-slate-300 pb-6 mb-6">
           <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900">TechCase Pro</h2>
           <p className="text-xs text-slate-500 mt-1">Sua loja de tecnologia premium</p>
           <p className="text-xs text-slate-500">Av. Paulista, 1000 - SP</p>
           <p className="text-xs text-slate-500">CNPJ: 00.000.000/0001-00</p>
        </div>

        <div className="space-y-2 text-sm text-slate-600 mb-6">
           <div className="flex justify-between">
             <span>Data:</span>
             <span className="font-medium text-slate-900">{new Date(sale.date).toLocaleString('pt-BR')}</span>
           </div>
           <div className="flex justify-between">
             <span>Pedido Nº:</span>
             <span className="font-mono font-bold text-slate-900">#{sale.id}</span>
           </div>
           <div className="flex justify-between">
             <span>Cliente:</span>
             <span className="font-medium text-slate-900">{sale.customerName}</span>
           </div>
           {sale.customerCpf && (
             <div className="flex justify-between">
               <span>CPF:</span>
               <span className="font-medium text-slate-900">{sale.customerCpf}</span>
             </div>
           )}
        </div>

        <div className="border-t border-b border-dashed border-slate-300 py-4 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase">
                <th className="pb-2">Qtd</th>
                <th className="pb-2">Item</th>
                <th className="pb-2 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {sale.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1 align-top w-8">{item.quantity}x</td>
                  <td className="py-1 align-top">{item.title}</td>
                  <td className="py-1 align-top text-right font-medium">
                    {(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mb-6">
           <div className="flex justify-between text-lg font-bold text-slate-900">
             <span>TOTAL</span>
             <span>R$ {sale.total.toFixed(2)}</span>
           </div>
           <p className="text-right text-sm text-slate-500 mt-1">Pagamento via {sale.paymentMethod}</p>
        </div>

        <div className="text-center">
          <div className="inline-block p-2 bg-slate-50 rounded-lg border border-slate-100 mb-2">
             <div className="w-32 h-8 flex items-center justify-center text-xs text-slate-400 tracking-[0.2em] font-mono">
               *CÓDIGO*
             </div>
          </div>
          <p className="text-[10px] text-slate-400 uppercase">Documento Auxiliar de Venda</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="max-w-sm w-full mt-8 space-y-3 print:hidden">
        <p className="text-center text-sm text-slate-500 mb-2">Escolha uma opção para finalizar:</p>
        
        <button 
          onClick={handlePrint}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
        >
          <Printer className="w-5 h-5" /> Imprimir e Voltar
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-2 bg-white text-slate-700 py-3.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-5 h-5" /> Compartilhar
          </button>
          
          <Link 
            to="/"
            className="flex items-center justify-center gap-2 bg-brand-600 text-white py-3.5 rounded-xl font-bold hover:bg-brand-700 transition-colors"
          >
            <Home className="w-5 h-5" /> Voltar ao Site
          </Link>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #customer-receipt, #customer-receipt * {
            visibility: visible;
          }
          #customer-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none;
            border: none;
          }
          @page {
            margin: 0;
            size: auto;
          }
          /* Hide Navbar and Footer specifically */
          nav, footer, header {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Success;