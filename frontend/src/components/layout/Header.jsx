import React from 'react';

const Header = () => {
  return (
    <header className="bg-familia-blue text-white py-6 shadow-lg">
      <div className="container-hebrew">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold font-hebrew">
            🏠 לה פמיליה דל שילו
          </h1>
          <div className="text-sm">
            <p>ברוכים הבאים למשפחת שילוביצקי 💙</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;