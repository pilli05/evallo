import React from "react";
import { useAuth } from "../../hook/useAuth";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Icon from "../../assets/icon.jpg";

const Header = () => {
  const { userData, setUserData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData({ name: "", email: "" });
    navigate("/login");
  };
  return (
    <div className=" p-3! md:p-5! flex items-center justify-between shadow-md sticky top-0">
      <div className="flex items-center">
        <img src={Icon} alt="Logo" className="w-10 h-10 rounded-full" />
        <span className="text-2xl font-bold text-blue-500 ml-1!">VALLO</span>
      </div>
      <div className="flex items-center justify-end">
        <h1 className="text-base font-bold mr-5!">Welcome, {userData.name}</h1>
        <AiOutlineLogout
          color="red"
          onClick={handleLogout}
          size={20}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Header;
