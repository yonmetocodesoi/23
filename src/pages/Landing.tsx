import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Eye, Clock, Layers, Shield } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';

const Landing: React.FC = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-indigo-400" />
            <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">
              MySpy
            </span>
          </div>
          
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="text-sm sm:text-base text-indigo-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              className="text-sm sm:text-base px-4 py-2 bg-indigo-700 bg-opacity-50 rounded-lg border border-indigo-500 hover:bg-opacity-70 transition-all"
            >
              Sign Up
            </Link>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="mt-16 md:mt-20 lg:mt-24 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Transforme cliques em inteligência com <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-300">MySpy</span>
          </h1>
          
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Monitore interações de links com geolocalização, dispositivo e muito mais
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/login">
              <Button primary className="w-full sm:w-auto flex items-center justify-center">
                Comece Agora <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Link to="/about">
              <Button primary={false} className="w-full sm:w-auto">
                Saiba Mais
              </Button>
            </Link>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="mt-24 md:mt-32">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Monitoramento inteligente que transforma sua estratégia
            </h2>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              Obtenha insights valiosos das interações com seus links personalizados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-900 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-indigo-900 hover:border-indigo-700 transition-all hover:transform hover:scale-105">
              <div className="bg-indigo-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Insights em Tempo Real</h3>
              <p className="opacity-75">
                Receba notificações instantâneas e acompanhe cada acesso ao seu link, permitindo respostas imediatas.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-900 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-indigo-900 hover:border-indigo-700 transition-all hover:transform hover:scale-105">
              <div className="bg-indigo-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tecnologia Leve e Precisa</h3>
              <p className="opacity-75">
                Nossa tecnologia de rastreamento é otimizada para funcionar sem comprometer a experiência do usuário final.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-900 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm border border-indigo-900 hover:border-indigo-700 transition-all hover:transform hover:scale-105">
              <div className="bg-indigo-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Dashboard Moderno</h3>
              <p className="opacity-75">
                Visualização organizada e intuitiva com dados detalhados sobre cada interação em um dashboard moderno.
              </p>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="mt-24 md:mt-32 mb-16 bg-gradient-to-r from-indigo-900 to-purple-900 bg-opacity-30 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para transformar suas estratégias digitais?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Junte-se a milhares de profissionais que utilizam o MySpy para obter insights valiosos a partir de interações com links.
            </p>
            <Link to="/login">
              <Button primary className="px-8 py-4">
                Comece Agora <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 bg-opacity-70 py-8">
        <div className="container mx-auto px-4 text-center text-sm opacity-75">
          <p>© {new Date().getFullYear()} MySpy. Todos os direitos reservados.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-indigo-300 transition-colors">Termos</a>
            <a href="#" className="hover:text-indigo-300 transition-colors">Privacidade</a>
            <a href="#" className="hover:text-indigo-300 transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;