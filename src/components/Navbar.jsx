import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, dToken, userData, logout } = useContext(AppContext);

  // Determine if the user is a doctor
  const isDoctor = !!dToken;

  return (
    <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD]">
      <img
        onClick={() => navigate("/")}
        className="w-44 cursor-pointer"
        src={assets.logo}
        alt="Logo"
      />
      <ul className="md:flex items-start gap-5 font-medium hidden">
        <NavLink to="/" activeClassName="text-primary">
          <li className="py-1">HOME</li>
        </NavLink>
        <NavLink to="/doctors" activeClassName="text-primary">
          <li className="py-1">ALL DOCTORS</li>
        </NavLink>
        <NavLink to="/about" activeClassName="text-primary">
          <li className="py-1">ABOUT</li>
        </NavLink>
        <NavLink to="/contact" activeClassName="text-primary">
          <li className="py-1">CONTACT</li>
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        {token || dToken ? (
          <div className="flex items-center gap-2 cursor-pointer group relative">
            <img
              className="w-8 h-8 rounded-full border border-gray-300"
              src={userData?.image || assets.default_avatar}
              alt="User Profile"
            />
            <img className="w-2.5" src={assets.dropdown_icon} alt="Dropdown" />
            <div className="absolute top-10 right-0 min-w-[150px] bg-gray-50 rounded shadow-lg py-2 hidden group-hover:block">
              <p
                onClick={() => navigate("/my-profile")}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                My Profile
              </p>
              {isDoctor ? (
                <>
                  <p
                    onClick={() => navigate("/upcoming-appointments")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Upcoming Appointments
                  </p>
                  <p
                    onClick={logout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </p>
                </>
              ) : (
                <>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Logout
                  </p>
                </>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className="w-6 md:hidden"
          src={assets.menu_icon}
          alt="Menu"
        />

        {/* ---- Mobile Menu ---- */}
        <div
          className={`md:hidden ${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img src={assets.logo} className="w-36" alt="Logo" />
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              className="w-7"
              alt="Close"
            />
          </div>
          <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium">
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/"
              className="px-4 py-2 hover:bg-gray-100"
            >
              HOME
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/doctors"
              className="px-4 py-2 hover:bg-gray-100"
            >
              ALL DOCTORS
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/about"
              className="px-4 py-2 hover:bg-gray-100"
            >
              ABOUT
            </NavLink>
            <NavLink
              onClick={() => setShowMenu(false)}
              to="/contact"
              className="px-4 py-2 hover:bg-gray-100"
            >
              CONTACT
            </NavLink>
            {token || dToken ? (
              <>
                <NavLink
                  onClick={() => {
                    setShowMenu(false);
                    navigate("/my-profile");
                  }}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  My Profile
                </NavLink>
                {isDoctor ? (
                  <NavLink
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/upcoming-appointments");
                    }}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    Upcoming Appointments
                  </NavLink>
                ) : (
                  <NavLink
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/my-appointments");
                    }}
                    className="px-4 py-2 hover:bg-gray-100"
                  >
                    My Appointments
                  </NavLink>
                )}
                <p
                  onClick={() => {
                    logout();
                    setShowMenu(false);
                  }}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </p>
              </>
            ) : (
              <NavLink
                onClick={() => setShowMenu(false)}
                to="/login"
                className="px-4 py-2 hover:bg-gray-100"
              >
                Login
              </NavLink>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
