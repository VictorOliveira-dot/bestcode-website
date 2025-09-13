
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const scrollToFAQ = () => {
    const faqSection = document.getElementById('faq-section');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { 
      name: "Cursos", 
      path: "/courses/qa-training",
      hasDropdown: false
    },
    { 
      name: "Perguntas Frequentes", 
      path: "#",
      hasDropdown: false,
      onClick: scrollToFAQ
    }
  ];

  return (
    <nav className="bg-white shadow-sm py-3 sm:py-4 sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/img/logotipo/logotipoBestCode.png" 
            alt="Code Academy" 
            className="h-8 sm:h-10"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex gap-6 xl:gap-8 items-center">
          <ul className="flex gap-4 xl:gap-6">
            {navItems.map((item) => (
              <li key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <button 
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 font-medium text-gray-700 hover:text-bestcode-600 transition-colors text-sm xl:text-base"
                  >
                    {item.name}
                    <ChevronDown size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={item.onClick || (() => {})}
                    className="font-medium text-gray-700 hover:text-bestcode-600 transition-colors text-sm xl:text-base"
                  >
                    {item.path === "#" ? item.name : <Link to={item.path}>{item.name}</Link>}
                  </button>
                )}

              </li>
            ))}
          </ul>
          <div className="flex gap-2 xl:gap-3">
            <Link to="/login">
              <Button variant="outline" className="font-medium hover:bg-bestcode-600 hover:text-white text-sm xl:text-base px-3 xl:px-4">Login</Button>
            </Link>
            <a href="https://typebot.co/lead-magnet-r-ki-1-nuh59rv" target="_blank" rel="noopener noreferrer">
              <Button className="bg-bestcode-600 hover:bg-bestcode-700 font-medium text-sm xl:text-base px-3 xl:px-4">Matricule-se</Button>
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden p-2" onClick={toggleMenu}>
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.name} className="border-b border-gray-100">
                  {item.hasDropdown ? (
                    <>
                      <button 
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full p-3 sm:p-4 font-medium text-sm sm:text-base"
                      >
                        {item.name}
                        <ChevronDown size={16} className={`transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        toggleMenu();
                        item.onClick && item.onClick();
                      }}
                      className="block w-full p-3 sm:p-4 font-medium text-gray-700 hover:text-bestcode-600 text-left text-sm sm:text-base"
                    >
                      {item.path === "#" ? item.name : <Link to={item.path}>{item.name}</Link>}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 p-3 sm:p-4">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full text-sm sm:text-base">Login</Button>
              </Link>
              <a href="https://typebot.co/lead-magnet-r-ki-1-nuh59rv" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
                <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700 text-sm sm:text-base">Matricule-se</Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
