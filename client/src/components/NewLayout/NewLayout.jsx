import React, { useEffect, useState, useContext } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./NewLayout.css";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSelector } from "react-redux";
import { ThemeContext } from "../../utils/ThemeContext";
import { Badge } from "antd";

const NewLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const { user } = useSelector((state) => state.user);
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  const logout = async () => {
    try {
      const response = await axios.post(
        "/api/v1/users/logout",
        {},
        {
          withCredentials: true, // Ensure cookies are included
        }
      );

      if (response.status === 200) {
        toast.success("User Logged Out");
        navigate("/login");
      } else {
        toast.error("Logout Failed");
      }
    } catch (error) {
      toast.error(error.response.d);
      console.log(error.response);
    }
  };

  useEffect(() => {
    const sideBar = document.querySelector(".sidebar");

    const searchBtn = document.querySelector(
      ".content nav form .form-input button"
    );

    const searchBtnIcon = document.querySelector(
      ".content nav form .form-input button .bx"
    );
    const searchForm = document.querySelector(".content nav form");

    searchBtn.addEventListener("click", function (e) {
      if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle("show");
        if (searchForm.classList.contains("show")) {
          searchBtnIcon.classList.replace("bx-search", "bx-x");
        } else {
          searchBtnIcon.classList.replace("bx-x", "bx-search");
        }
      }
    });

    const handleResize = () => {
      if (window.innerWidth < 768) {
        sideBar.classList.add("close");
      } else {
        sideBar.classList.remove("close");
      }
      if (window.innerWidth > 576) {
        searchBtnIcon.classList.replace("bx-x", "bx-search");
        searchForm.classList.remove("show");
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial call to set the correct state
  }, []);

  const userMenu = [
    {
      key: "1",
      icon: "bx bxs-home-heart",
      label: "Home",
      path: "/home",
    },
    {
      key: "2",
      icon: "bx bx-notepad",
      label: "Appointments",
      path: "/appointments",
    },
    {
      key: "3",
      icon: "bx bx-plus-medical",
      label: "Apply Doctor",
      path: "/apply-doctor",
    },
    {
      key: "4",
      icon: "bx bx-user",
      label: "Profile",
      path: "/profile",
    },
  ];
  const adminMenu = [
    {
      key: "1",
      icon: "bx bxs-home-heart",
      label: "Home",
      path: "/home",
    },
    {
      key: "2",
      icon: "bx bx-user-pin",
      label: "Users",
      path: "/admin/list-of-users",
    },
    {
      key: "3",
      icon: "bx bx-plus-medical",
      label: "Doctors",
      path: "/admin/list-of-doctors",
    },
    {
      key: "4",
      icon: "bx bx-user",
      label: "Profile",
      path: "/profile",
    },
  ];

  const doctorMenu = [
    {
      key: "1",
      label: "Home",
      icon: "bx bxs-home-heart",
      path: "/home",
    },
    {
      key: "2",
      label: "Appointments",
      path: "/doctor/appointments",
      icon: "bx bx-notepad",
    },
    {
      key: "3",
      label: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "bx bx-user",
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;
  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";

  return (
    <div>
      <div className={`sidebar ${collapsed ? "close" : ""}`}>
        <a href="#" className="logo">
          <i className="bx bx-pulse"></i>
          <div className="logo-name">
            <span>Health</span>ify
          </div>
        </a>
        {/* <h2 className="role">{role}</h2> */}
        <ul className="side-menu">
          {menuToBeRendered.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.key} className={isActive ? "active" : ""}>
                <Link to={item.path}>
                  <i className={item.icon}></i>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <ul className="side-menu">
          <li>
            <Link className="logout" onClick={logout}>
              <i className="bx bx-log-out-circle"></i>
              Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className="content">
        <nav>
          {/* <i className="bx bx-menu menu-icon" onClick={() => setCollapsed(!collapsed)}></i> */}
          <div
            className={`nav-icon1 ${collapsed ? "" : "open"}`}
            onClick={() => setCollapsed(!collapsed)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
          
          <form action="#">
            <div className="form-input">
              <input type="search" placeholder="Search..." />
              <button className="search-btn" type="submit">
                <i className="bx bx-search"></i>
              </button>
            </div>
          </form>
          <input type="checkbox" id="theme-toggle" hidden />
          <label
            htmlFor="theme-toggle"
            className="theme-toggle"
            onClick={toggleTheme}
          ></label>
          
          <a href="#" className="notif">
            <Badge count={user?.unseenNotifications.length || 0}>
              <i
                className="bx bx-bell"
                onClick={() => navigate("/notifications")}
              ></i>
            </Badge>
          </a>
          <NavLink to={"/profile"} className="profile">
            <img src={user?.avatar} alt="Profile" />
          </NavLink>
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default NewLayout;
