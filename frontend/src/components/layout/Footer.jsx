import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-familia-blue text-white py-8 mt-16">
      <div className="container-hebrew">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-4">
            ✨ לה פמיליה דל שילו ✨
          </h3>
          <p className="text-familia-warm mb-2">
            "המשפחה היא הכל - היא המקור, היא המטרה, והיא הבית האמיתי" 💙
          </p>
          <p className="text-sm opacity-75">
            © {currentYear} משפחת שילוביצקי • נבנה באהבה ובגאווה משפחתית
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;