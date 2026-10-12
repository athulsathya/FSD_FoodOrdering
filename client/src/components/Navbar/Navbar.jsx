
import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { GiForkKnifeSpoon } from "react-icons/gi";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import {
  FiBookOpen,
  FiHome,
  FiPhone,
  FiStar,
  FiShoppingCart,
  FiArrowUpRight,
  FiLogOut,
  FiKey,
} from "react-icons/fi";

import { useCart } from "../../cartContext/CartContext";
import Login from "../Login/Login";

const navLinks = [
  { name: "Home", path: "/", icon: FiHome },
  { name: "Menu", path: "/menu", icon: FiBookOpen },
  { name: "About", path: "/about", icon: FiStar },
  { name: "Contact", path: "/contact", icon: FiPhone },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { totalItems = 0 } = useCart();

  // Login modal state
  const [showLoginModal, setShowLoginModal] = useState(
    location.pathname === "/login"
  );

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem("loginData"))
  );

  // Update modal and authentication on route change
  useEffect(() => {
    setShowLoginModal(location.pathname === "/login");

    setIsAuthenticated(
      Boolean(localStorage.getItem("loginData"))
    );

    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle successful login
  const handleLoginSuccess = () => {
    // Login component should save loginData first
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setIsMenuOpen(false);
    navigate("/");
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("loginData");

    setIsAuthenticated(false);
    setShowLoginModal(false);
    setIsMenuOpen(false);

    navigate("/");
  };

  // Desktop authentication button
  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <button
        type="button"
        onClick={handleLogout}
        className="group flex items-center justify-center gap-2 rounded-xl border border-[#D9A65C]/40 bg-gradient-to-r from-[#D9A65C] via-[#E9BB7A] to-[#C9954E] px-3 py-2.5 text-xs font-semibold tracking-wide text-[#24150B] shadow-[0_4px_15px_rgba(217,166,92,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_25px_rgba(217,166,92,0.3)] active:scale-95 md:px-4 lg:px-6 lg:py-3 lg:text-sm"
      >
        <FiLogOut className="text-base lg:text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => navigate("/login")}
        className="group flex items-center justify-center gap-2 rounded-xl border border-[#D9A65C]/40 bg-gradient-to-r from-[#D9A65C] via-[#E9BB7A] to-[#C9954E] px-3 py-2.5 text-xs font-semibold tracking-wide text-[#24150B] shadow-[0_4px_15px_rgba(217,166,92,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_8px_25px_rgba(217,166,92,0.3)] active:scale-95 md:px-4 lg:px-6 lg:py-3 lg:text-sm"
      >
        <FiKey className="text-base lg:text-lg" />
        <span>Login</span>
      </button>
    );
  };

  // Mobile authentication button
  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9A65C]/40 bg-gradient-to-r from-[#D9A65C] via-[#E9BB7A] to-[#C9954E] px-3 py-3.5 text-sm font-bold text-[#24150B] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
      >
        <FiLogOut className="text-lg" />
        <span>Logout</span>
      </button>
    ) : (
      <button
        type="button"
        onClick={() => {
          navigate("/login");
          setIsMenuOpen(false);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D9A65C]/40 bg-gradient-to-r from-[#D9A65C] via-[#E9BB7A] to-[#C9954E] px-3 py-3.5 text-sm font-bold text-[#24150B] shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 active:scale-95"
      >
        <FiKey className="text-lg" />
        <span>Login to FoodHub</span>
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans">
      <nav className="relative border-b border-[#C89B5B]/20 bg-[#1B110C]/95 shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        {/* PREMIUM TOP ACCENT */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#D9A65C] to-transparent" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[76px] items-center justify-between gap-4 lg:h-[88px]">
            {/* BRAND LOGO */}
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="group flex shrink-0 items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D9A65C]/35 bg-gradient-to-br from-[#4A2B17] to-[#27160E] shadow-[0_4px_18px_rgba(217,166,92,0.12)] transition-all duration-300 group-hover:rotate-6 group-hover:border-[#D9A65C]/70 sm:h-12 sm:w-12">
                <GiForkKnifeSpoon className="text-xl text-[#E9BA75] sm:text-2xl" />
              </div>

              <div className="flex flex-col">
                <span className="font-serif text-[25px] font-bold leading-none tracking-tight text-[#F5D6A0] sm:text-[29px]">
                  Food<span className="text-white">Hub</span>
                </span>

                <span className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#C9A87B] sm:text-[9px]">
                  Crafted With Passion
                </span>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION */}
            <div className="hidden items-center gap-1 lg:flex xl:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2 rounded-lg px-3 py-3 text-[13px] font-medium tracking-wide transition-all duration-300 xl:px-4 xl:text-sm ${
                        isActive
                          ? "text-[#F3C789]"
                          : "text-[#E8D8C5]/80 hover:bg-white/5 hover:text-[#F3C789]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`text-[17px] transition-transform duration-300 group-hover:-translate-y-0.5 ${
                            isActive
                              ? "text-[#E9B56E]"
                              : "text-[#BFA68A]"
                          }`}
                        />

                        <span>{link.name}</span>

                        <span
                          className={`absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-[#D9A65C] transition-all duration-300 ${
                            isActive
                              ? "w-7 opacity-100"
                              : "w-0 opacity-0 group-hover:w-7 group-hover:opacity-100"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* CART */}
              <Link
                to="/cart"
                aria-label={`Shopping cart with ${totalItems} items`}
                className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#D9A65C]/20 bg-white/[0.04] text-[#F1D6AE] transition-all duration-300 hover:border-[#D9A65C]/60 hover:bg-[#D9A65C]/10 hover:text-[#F5C47E] sm:h-11 sm:w-11"
              >
                <FiShoppingCart className="text-[21px] transition-transform duration-300 group-hover:-translate-y-0.5" />

                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#1B110C] bg-[#E9B56E] px-1 text-[10px] font-bold text-[#24150B]">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {/* DESKTOP LOGIN / LOGOUT */}
              <div className="hidden lg:flex">
                {renderDesktopAuthButton()}
              </div>

              {/* MOBILE MENU TOGGLE */}
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                aria-label={
                  isMenuOpen ? "Close menu" : "Open menu"
                }
                aria-expanded={isMenuOpen}
                aria-controls="mobile-navigation"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D9A65C]/25 bg-white/[0.04] text-[#E9BA75] transition-all duration-300 hover:bg-[#D9A65C]/10 sm:h-11 sm:w-11 lg:hidden"
              >
                {isMenuOpen ? (
                  <HiX className="text-[25px]" />
                ) : (
                  <HiMenuAlt3 className="text-[25px]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE / TABLET MENU */}
        <div
          id="mobile-navigation"
          className={`overflow-hidden border-[#D9A65C]/15 bg-[#21140D] transition-[max-height,opacity] duration-300 ease-in-out lg:hidden ${
            isMenuOpen
              ? "max-h-[500px] border-t opacity-100"
              : "max-h-0 border-t-0 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-5 sm:px-6">
            <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B99A72]">
              Explore FoodHub
            </p>

            {navLinks.map((link) => {
              const Icon = link.icon;

              return (
                <NavLink
                  key={link.name}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-300 ${
                      isActive
                        ? "border-[#D9A65C]/30 bg-[#D9A65C]/10 text-[#F3C789]"
                        : "border-transparent text-[#E8D8C5] hover:border-[#D9A65C]/15 hover:bg-white/5"
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-[19px] text-[#D9A65C]" />
                    <span className="text-sm font-medium">
                      {link.name}
                    </span>
                  </div>

                  <FiArrowUpRight className="text-[16px] text-[#B99A72] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </NavLink>
              );
            })}

            {/* MOBILE LOGIN / LOGOUT */}
            <div className="pt-4">
              {renderMobileAuthButton()}
            </div>

            <p className="pt-4 text-center text-[10px] uppercase tracking-[0.2em] text-[#94785B]">
              Good Food. Great Moments.
            </p>
          </div>
        </div>
      </nav>

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onClose={() => navigate("/")}
        />
      )}
    </header>
  );
}

export default Navbar;
