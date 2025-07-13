
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
      name: "Nossos Cursos", 
      path: "/courses/qa-training",
      hasDropdown: false
    },
    { 
      name: "Sobre Nós", 
      path: "/about",
      hasDropdown: false
    },
    { 
      name: "FAQ", 
      path: "#",
      hasDropdown: false,
      onClick: scrollToFAQ
    }
  ];

  return (
    <nav className="bg-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/img/logotipo/logotipoBestCode.png" 
            alt="Code Academy" 
            className="h-10"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <ul className="flex gap-6">
            {navItems.map((item) => (
              <li key={item.name} className="relative group">
                {item.hasDropdown ? (
                  <button 
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center gap-1 font-medium text-gray-700 hover:text-bestcode-600 transition-colors"
                  >
                    {item.name}
                    <ChevronDown size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={item.onClick || (() => {})}
                    className="font-medium text-gray-700 hover:text-bestcode-600 transition-colors"
                  >
                    {item.path === "#" ? item.name : <Link to={item.path}>{item.name}</Link>}
                  </button>
                )}

              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="outline" className="font-medium hover:bg-bestcode-600 hover:text-white">Login</Button>
            </Link>
            <a href="https://typebot.co/lead-magnet-r-ki-1-nuh59rv" target="_blank" rel="noopener noreferrer">
              <Button className="bg-bestcode-600 hover:bg-bestcode-700 font-medium">Matricule-se</Button>
            </a>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50">
            <ul className="flex flex-col">
              {navItems.map((item) => (
                <li key={item.name} className="border-b border-gray-100">
                  {item.hasDropdown ? (
                    <>
                      <button 
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full p-4 font-medium"
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
                      className="block w-full p-4 font-medium text-gray-700 hover:text-bestcode-600 text-left"
                    >
                      {item.path === "#" ? item.name : <Link to={item.path}>{item.name}</Link>}
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="flex flex-col gap-2 p-4">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Login</Button>
              </Link>
              <a href="https://typebot.co/lead-magnet-r-ki-1-nuh59rv" target="_blank" rel="noopener noreferrer" onClick={toggleMenu}>
                <Button className="w-full bg-bestcode-600 hover:bg-bestcode-700">Matricule-se</Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
