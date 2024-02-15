import { NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {

  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div
      className="p-4 flex justify-between items-center"
      style={{
        backgroundColor: "#073674",
      }}
    >
      <h2 className="font-bold text-white text-xs md:text-lg">The Union</h2>

      <div className="flex space-x-4">
        <NavLink to="/accounts" className="text-white text-xs md:text-lg">
          Accounts
        </NavLink>
        <NavLink to="/volunteers" className="text-white text-xs md:text-lg">
          Volunteers
        </NavLink>
        <NavLink to="/patients" className="text-white text-xs md:text-lg">
          Patients
        </NavLink>
        <NavLink to="/vot-patients" className="text-white text-xs md:text-lg">
          VOT Patients
        </NavLink>
        <NavLink
          to="/"
          className="text-white text-xs md:text-lg"
          onClick={() => {
            // Perform logout operations here
            localStorage.clear();
          }}
        >
          Logout
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
