import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Users, Tag, LogOut, Plus, Trash2, Edit2, 
  Save, X, Upload, ShoppingBag, Search, AlertTriangle, User as UserIcon,
  CreditCard, Settings, Bitcoin, ToggleLeft, ToggleRight, RotateCcw
} from 'lucide-react';
import { Product, Category, User, PaymentConfig } from '../types';

const AdminPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { 
    products, categories, sellers, sales, paymentSettings,
    addProduct, updateProduct, deleteProduct, 
    addCategory, updateCategory, deleteCategory,
    addSeller, updateSeller, deleteSeller,
    updatePaymentSetting,
    resetData 
  } = useData();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'sellers' | 'sales' | 'payments'>('products');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- Generic Modal Handling ---
  const openModal = (item?: any) => {
    setEditingItem(item || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // --- Image Upload Simulator ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem((prev: any) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Forms ---
  const renderProductForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (editingItem.id) updateProduct(editingItem);
      else addProduct(editingItem);
      closeModal();
    }} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">{editingItem.id ? 'Editar Produto' : 'Novo Produto'}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium mb-1">Nome do Produto</label>
           <input required type="text" className="w-full p-2 border rounded" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
        </div>
        <div>
           <label className="block text-sm font-medium mb-1">Categoria</label>
           <select required className="w-full p-2 border rounded" value={editingItem.category || ''} onChange={e => setEditingItem({...editingItem, category: e.target.value})}>
             <option value="">Selecione...</option>
             {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
           </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium mb-1">Preço Atual (R$)</label>
           <input required type="number" step="0.01" className="w-full p-2 border rounded" value={editingItem.price || ''} onChange={e => setEditingItem({...editingItem, price: parseFloat(e.target.value)})} />
        </div>
        <div>
           <label className="block text-sm font-medium mb-1">Preço Original (R$ - opcional)</label>
           <input type="number" step="0.01" className="w-full p-2 border rounded" value={editingItem.originalPrice || ''} onChange={e => setEditingItem({...editingItem, originalPrice: parseFloat(e.target.value)})} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imagem do Produto</label>
        <div className="flex gap-4 items-center">
          {editingItem.image && <img src={editingItem.image} alt="Preview" className="w-16 h-16 object-cover rounded border" />}
          <div className="flex-1">
             <input type="text" placeholder="URL da Imagem" className="w-full p-2 border rounded mb-2" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
             <div className="relative">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="prod-img-upload" />
                <label htmlFor="prod-img-upload" className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm text-slate-700 border border-slate-300">
                  <Upload className="w-4 h-4" /> Upload Local (Mock)
                </label>
             </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="isNew" checked={editingItem.isNew || false} onChange={e => setEditingItem({...editingItem, isNew: e.target.checked})} />
        <label htmlFor="isNew" className="text-sm">Marcar como "Novo Lançamento"</label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-brand-600">Salvar</button>
      </div>
    </form>
  );

  const renderCategoryForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (editingItem.id) updateCategory(editingItem);
      else addCategory(editingItem);
      closeModal();
    }} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">{editingItem.id ? 'Editar Categoria' : 'Nova Categoria'}</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Nome</label>
        <input required type="text" className="w-full p-2 border rounded" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Imagem de Capa</label>
        <div className="flex gap-4 items-center">
           <div className="flex-1">
             <input type="text" placeholder="URL da Imagem" className="w-full p-2 border rounded mb-2" value={editingItem.image || ''} onChange={e => setEditingItem({...editingItem, image: e.target.value})} />
             <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded text-sm border">
               <Upload className="w-4 h-4" /> Upload
               <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
             </label>
           </div>
           {editingItem.image && <img src={editingItem.image} alt="Preview" className="w-16 h-16 object-cover rounded border" />}
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-brand-600">Salvar</button>
      </div>
    </form>
  );

  const renderSellerForm = () => (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (editingItem.id) {
        updateSeller(editingItem);
      } else {
        addSeller({ ...editingItem, role: 'seller', id: Date.now().toString() });
      }
      closeModal();
    }} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">{editingItem.id ? 'Editar Vendedor' : 'Novo Vendedor'}</h3>
      <div>
        <label className="block text-sm font-medium mb-1">Nome Completo</label>
        <input required type="text" className="w-full p-2 border rounded" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Usuário de Login</label>
        <input required type="text" className="w-full p-2 border rounded" value={editingItem.username || ''} onChange={e => setEditingItem({...editingItem, username: e.target.value})} />
      </div>
      <p className="text-xs text-slate-500">Senha padrão: '123'</p>
      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
        <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-brand-600">Salvar</button>
      </div>
    </form>
  );

  const renderPaymentForm = () => {
    const isApi = editingItem.type === 'api';
    const isPix = editingItem.id === 'pix';
    const isCrypto = editingItem.type === 'crypto';

    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        updatePaymentSetting(editingItem);
        closeModal();
      }} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" /> Configurar {editingItem.name}
          </h3>
          <button 
             type="button"
             onClick={() => setEditingItem({...editingItem, active: !editingItem.active})}
             className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 transition-colors ${editingItem.active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
          >
             {editingItem.active ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
             {editingItem.active ? 'Ativado' : 'Desativado'}
          </button>
        </div>
        
        {isApi && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Ambiente</label>
              <select 
                className="w-full p-2 border rounded"
                value={editingItem.config.mode || 'sandbox'}
                onChange={e => setEditingItem({...editingItem, config: {...editingItem.config, mode: e.target.value}})}
              >
                <option value="sandbox">Sandbox (Teste)</option>
                <option value="production">Produção (Real)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Public Key / API Key</label>
              <input type="text" className="w-full p-2 border rounded font-mono text-sm" value={editingItem.config.publicKey || ''} onChange={e => setEditingItem({...editingItem, config: {...editingItem.config, publicKey: e.target.value}})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Private Key / Token</label>
              <input type="password" className="w-full p-2 border rounded font-mono text-sm" value={editingItem.config.privateKey || ''} onChange={e => setEditingItem({...editingItem, config: {...editingItem.config, privateKey: e.target.value}})} />
            </div>
          </>
        )}

        {isPix && (
          <>
             <div>
               <label className="block text-sm font-medium mb-1">Tipo de Integração</label>
               <select 
                 className="w-full p-2 border rounded"
                 value={editingItem.type}
                 onChange={e => setEditingItem({...editingItem, type: e.target.value})}
               >
                 <option value="manual">Chave Pix Manual (Estático)</option>
                 <option value="api">API (Dinâmico - Banco)</option>
               </select>
             </div>
             {editingItem.type === 'manual' ? (
                <div>
                   <label className="block text-sm font-medium mb-1">Chave Pix</label>
                   <input type="text" className="w-full p-2 border rounded" value={editingItem.config.pixKey || ''} onChange={e => setEditingItem({...editingItem, config: {...editingItem.config, pixKey: e.target.value}})} />
                   <p className="text-xs text-slate-500 mt-1">Essa chave aparecerá para o cliente fazer a transferência.</p>
                </div>
             ) : (
                <div>
                   <label className="block text-sm font-medium mb-1">Client Secret / API Token</label>
                   <input type="password" className="w-full p-2 border rounded font-mono text-sm" value={editingItem.config.privateKey || ''} onChange={e => setEditingItem({...editingItem, config: {...editingItem.config, privateKey: e.target.value}})} />
                </div>
             )}
          </>
        )}

        {isCrypto && (
          <>
            <div>
               <label className="block text-sm font-medium mb-1">Rede (Network)</label>
               <input type="text" className="w-full p-2 border rounded" placeholder="Ex: TRC20, ERC20" value={editingItem.config.network || ''} onChange={e => setEditingItem({...editingItem, config: {...editingItem.config, network: e.target.value}})} />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Endereço da Carteira (Wallet Address)</label>
               <input type="text" className="w-full p-2 border rounded font-mono text-sm" value={editingItem.config.walletAddress || ''} onChange={e => setEditingItem({...editingItem, config: {...editingItem.config, walletAddress: e.target.value}})} />
            </div>
          </>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t mt-4">
          <button type="button" onClick={closeModal} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded hover:bg-brand-600">Salvar Configurações</button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:block">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Admin<span className="text-brand-500">Panel</span></h2>
          <p className="text-xs text-slate-400 mt-1">Olá, {user.name}</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-brand-600' : 'hover:bg-slate-800'}`}>
            <Package className="w-5 h-5" /> Produtos
          </button>
          <button onClick={() => setActiveTab('categories')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-brand-600' : 'hover:bg-slate-800'}`}>
            <Tag className="w-5 h-5" /> Categorias
          </button>
          <button onClick={() => setActiveTab('sellers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'sellers' ? 'bg-brand-600' : 'hover:bg-slate-800'}`}>
            <Users className="w-5 h-5" /> Vendedores
          </button>
          <button onClick={() => setActiveTab('payments')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'payments' ? 'bg-brand-600' : 'hover:bg-slate-800'}`}>
            <CreditCard className="w-5 h-5" /> Pagamentos
          </button>
          <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'sales' ? 'bg-brand-600' : 'hover:bg-slate-800'}`}>
            <ShoppingBag className="w-5 h-5" /> Relatório de Vendas
          </button>
          
          <div className="pt-8 mt-8 border-t border-slate-700">
             <button onClick={resetData} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800">
               <AlertTriangle className="w-5 h-5" /> Resetar Dados
             </button>
             <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 text-slate-400">
               <LogOut className="w-5 h-5" /> Sair
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
         {/* Mobile Header */}
         <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
             <span className="font-bold">Admin Panel</span>
             <button onClick={handleLogout}><LogOut className="w-5 h-5" /></button>
         </div>

         {/* Products Tab */}
         {activeTab === 'products' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-800">Gerenciar Produtos</h2>
               <button onClick={() => openModal()} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
                 <Plus className="w-5 h-5" /> Novo Produto
               </button>
             </div>
             
             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50 text-slate-600">
                   <tr>
                     <th className="p-4">Produto</th>
                     <th className="p-4">Categoria</th>
                     <th className="p-4">Preço</th>
                     <th className="p-4 text-right">Ações</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {products.map(product => (
                     <tr key={product.id} className="hover:bg-slate-50">
                       <td className="p-4 flex items-center gap-3">
                         <img src={product.image} alt="" className="w-10 h-10 rounded object-cover" />
                         <span className="font-medium">{product.title}</span>
                         {product.isNew && <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded">Novo</span>}
                       </td>
                       <td className="p-4 text-slate-600">{product.category}</td>
                       <td className="p-4 font-semibold">R$ {product.price.toFixed(2)}</td>
                       <td className="p-4 text-right space-x-2">
                         <button onClick={() => openModal(product)} className="text-brand-600 hover:bg-brand-50 p-2 rounded"><Edit2 className="w-4 h-4" /></button>
                         <button onClick={() => deleteProduct(product.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
         )}

         {/* Categories Tab */}
         {activeTab === 'categories' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-800">Gerenciar Categorias</h2>
               <button onClick={() => openModal()} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
                 <Plus className="w-5 h-5" /> Nova Categoria
               </button>
             </div>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {categories.map(cat => (
                 <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm group">
                    <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover rounded-lg mb-4" />
                    <h3 className="font-bold text-center mb-3">{cat.name}</h3>
                    <div className="flex justify-center gap-2 pt-2 border-t border-slate-100">
                      <button onClick={() => openModal(cat)} className="text-brand-600 hover:bg-brand-50 p-2 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                    </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* Sellers Tab */}
         {activeTab === 'sellers' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-800">Equipe de Vendas</h2>
               <button onClick={() => openModal()} className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700">
                 <Plus className="w-5 h-5" /> Adicionar Vendedor
               </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {sellers.map(seller => (
                 <div key={seller.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mb-4">
                      <UserIcon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-lg">{seller.name}</h3>
                    <p className="text-slate-500 mb-4">@{seller.username}</p>
                    <div className="flex gap-2 w-full justify-center">
                      <button onClick={() => openModal(seller)} className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:bg-brand-50 px-3 py-2 rounded border border-brand-200">
                         <Edit2 className="w-3 h-3" /> Editar
                      </button>
                      <button onClick={() => deleteSeller(seller.id)} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded border border-red-200">
                         <Trash2 className="w-3 h-3" /> Excluir
                      </button>
                    </div>
                 </div>
               ))}
             </div>
           </div>
         )}

         {/* Payments Tab */}
         {activeTab === 'payments' && (
           <div className="space-y-6">
             <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-800">Configuração de Pagamentos (Checkout)</h2>
               {paymentSettings.length === 0 && (
                 <button 
                   onClick={() => window.location.reload()} 
                   className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                 >
                   <RotateCcw className="w-4 h-4" /> Tentar Recarregar
                 </button>
               )}
             </div>
             
             {paymentSettings.length === 0 ? (
               <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                 <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                 <h3 className="text-lg font-bold text-slate-900 mb-2">Nenhum método de pagamento encontrado</h3>
                 <p className="text-slate-500 mb-6 max-w-md mx-auto">
                   Parece que as configurações de pagamento foram perdidas ou corrompidas. Você pode restaurar os padrões do sistema.
                 </p>
                 <button 
                   onClick={resetData}
                   className="bg-brand-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors inline-flex items-center gap-2"
                 >
                   <RotateCcw className="w-5 h-5" /> Restaurar Dados Padrão
                 </button>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {paymentSettings.map(config => (
                   <div key={config.id} className={`p-6 rounded-xl shadow-sm border-2 transition-all ${config.active ? 'border-brand-500 bg-white' : 'border-slate-200 bg-slate-50'}`}>
                      <div className="flex justify-between items-start mb-4">
                         <div className="flex items-center gap-3">
                           <div className={`p-2 rounded-lg ${config.active ? 'bg-brand-100 text-brand-600' : 'bg-slate-200 text-slate-400'}`}>
                              {config.id === 'crypto' ? <Bitcoin className="w-6 h-6" /> : <CreditCard className="w-6 h-6" />}
                           </div>
                           <div>
                              <h3 className="font-bold text-slate-900">{config.name}</h3>
                              <span className="text-xs uppercase font-semibold text-slate-500">{config.type}</span>
                           </div>
                         </div>
                         <div className={`w-3 h-3 rounded-full ${config.active ? 'bg-green-500' : 'bg-red-300'}`} />
                      </div>
                      
                      <div className="space-y-2 text-sm text-slate-600 mb-6 min-h-[40px]">
                         {config.type === 'api' && (
                           <p>Modo: <span className="font-mono">{config.config.mode || 'N/A'}</span></p>
                         )}
                         {config.id === 'pix' && config.type === 'manual' && (
                           <p className="truncate">Chave: <span className="font-mono">{config.config.pixKey || 'Não configurada'}</span></p>
                         )}
                         {config.id === 'crypto' && (
                           <p className="truncate">Rede: <span className="font-mono">{config.config.network || 'N/A'}</span></p>
                         )}
                      </div>

                      <button 
                        onClick={() => openModal(config)}
                        className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 text-sm font-medium transition-colors"
                      >
                        <Settings className="w-4 h-4" /> Configurar
                      </button>
                   </div>
                 ))}
               </div>
             )}
           </div>
         )}

         {/* Sales Report Tab */}
         {activeTab === 'sales' && (
           <div className="space-y-6">
             <h2 className="text-2xl font-bold text-slate-800">Relatório de Vendas</h2>
             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Vendedor / Origem</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Pagamento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sales.length === 0 ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-500">Nenhuma venda registrada ainda.</td></tr>
                    ) : (
                      sales.map(sale => (
                        <tr key={sale.id}>
                          <td className="p-4 font-mono text-sm text-slate-500">#{sale.id}</td>
                          <td className="p-4">
                             {sale.sellerName ? (
                               <span className="flex items-center gap-2 text-brand-700 font-medium">
                                 <Users className="w-4 h-4" /> {sale.sellerName}
                               </span>
                             ) : (
                               <span className="text-slate-500">Venda Online</span>
                             )}
                          </td>
                          <td className="p-4 text-sm">
                            <p className="font-semibold">{sale.customerName || 'Consumidor Final'}</p>
                            {sale.customerCpf && <p className="text-xs text-slate-500">CPF: {sale.customerCpf}</p>}
                          </td>
                          <td className="p-4 font-bold">R$ {sale.total.toFixed(2)}</td>
                          <td className="p-4 text-sm text-slate-500">{new Date(sale.date).toLocaleString('pt-BR')}</td>
                          <td className="p-4 capitalize">{sale.paymentMethod}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
             </div>
           </div>
         )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
            </button>
            {activeTab === 'products' && renderProductForm()}
            {activeTab === 'categories' && renderCategoryForm()}
            {activeTab === 'sellers' && renderSellerForm()}
            {activeTab === 'payments' && renderPaymentForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;