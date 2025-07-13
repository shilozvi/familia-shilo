import React from 'react';
import Header from './Header';
import Navigation from './Navigation';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-familia-warm to-white">
      <Header />
      <Navigation />
      <main className="container-hebrew py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;