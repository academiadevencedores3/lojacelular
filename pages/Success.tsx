import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';

const Success: React.FC = () => {
  const location = useLocation();
  const state = location.state as { orderId: number; customerName: string } | null;

  if (!state) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pedido Confirmado!</h1>
        <p className="text-slate-600 mb-8">
          Obrigado, <span className="font-semibold text-slate-900">{state.customerName}</span>! <br/>
          Seu pedido <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800">#{state.orderId}</span> foi recebido com sucesso.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-8 text-left">
          <h3 className="font-semibold text-slate-900 mb-2">Próximos Passos:</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 mt-0.5">1</span>
              <span>Você receberá um e-mail com os detalhes da compra.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-700 mt-0.5">2</span>
              <span>Nossa equipe entrará em contato via WhatsApp para confirmar a entrega.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link 
            to="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Continuar Comprando
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;