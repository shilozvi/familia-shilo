import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '🏠 דף הבית', icon: '🏠' },
    { path: '/events', label: '📅 לוח אירועים', icon: '📅' },
    { path: '/gallery', label: '🖼️ גלריית תמונות', icon: '🖼️' },
    { path: '/discussions', label: '💬 שלשורים', icon: '💬' },
    { path: '/about', label: '👨‍👩‍👧‍👦 אודות המשפחה', icon: '👨‍👩‍👧‍👦' },
  ];

  return (
    <nav className="bg-white shadow-md border-b-2 border-familia-gold">
      <div className="container-hebrew">
        <div className="flex space-x-reverse space-x-8 overflow-x-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                ${location.pathname === item.path 
                  ? 'bg-familia-blue text-white' 
                  : 'text-familia-blue hover:bg-familia-warm'}
              `}
            >
              <span className="text-lg mr-2">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;