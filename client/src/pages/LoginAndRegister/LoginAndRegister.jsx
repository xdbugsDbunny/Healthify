import React, { useState } from "react";
import "./LoginAndRegister.modules.css"; // Import your CSS file
import { Upload, DatePicker } from "antd";
import dayjs from "dayjs";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertReducer";

const LoginAndRegister = () => {
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined style={{ color: "black" }} />
      <div
        style={{
          marginTop: 8,
          color: "black",
        }}
      >
        Upload
      </div>
    </button>
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [fileList, setFileList] = useState([]);

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: null, // Adjusted to null to properly handle date
    avatar: "",
  });

  const [loginData, setLoginData] = useState({
    emailOrPhone: "",
    password: "",
  });

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({
      ...registerData,
      [name]: value,
    });
  };

  const handleDateChange = (date, dateString) => {
    setRegisterData({
      ...registerData,
      dob: date ? dayjs(date).format(dateFormatList[0]) : null, // Using dayjs to format the date
    });
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const beforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setRegisterData({
        ...registerData,
        avatar: newFileList[0].originFileObj,
      });
    }
  };

  const resetForm = () => {
    setRegisterData({
      name: "",
      email: "",
      password: "",
      phone: "",
      dob: null,
      avatar: "",
    });
    setFileList([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/users/register",
        registerData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(hideLoading());
      console.log(registerData);
      if (response.data.success) {
        toast.success(response.data.message);
        toggleForm();
        navigate('/login')
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response.data.message);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/v1/users/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // To include Cookies
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/home");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response.data.message);
    }
  };

  const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

  return (
    <div className="login-and-register">
      <div className={`container ${isSignIn ? "" : "active"}`}>
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <span>or use your email for registration</span>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={registerData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={registerData.email}
              onChange={handleInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={registerData.password}
              onChange={handleInputChange}
            />
            <input
              type="phone"
              name="phone"
              placeholder="Phone"
              value={registerData.phone}
              onChange={handleInputChange}
            />
            <DatePicker
              name="dob"
              defaultValue={dayjs("01/01/1998", dateFormatList[0])}
              format={dateFormatList}
              value={
                registerData.dob
                  ? dayjs(registerData.dob, dateFormatList[0])
                  : null
              }
              onChange={handleDateChange}
              className="date-picker"
              placeholder="Date Of Birth"
            />
            <Upload
              listType="picture-circle"
              fileList={fileList}
              name="avatar"
              value={registerData.avatar}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              showUploadList={{
                showPreviewIcon: false,
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <button type="submit">Sign Up</button>
          </form>
        </div>
        <div className="form-container sign-in">
          <form onSubmit={handleLoginSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon">
                <i className="fa-brands fa-google-plus-g"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="#" className="icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
            <input
              type="text"
              name="emailOrPhone"
              placeholder="Email or Phone"
              value={loginData.emailOrPhone}
              onChange={handleLoginInputChange}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleLoginInputChange}
            />
            <a href="#">Forget Your Password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all site features</p>
              <Link to={"/login"}>
                <button
                  className={isSignIn ? "hidden" : ""}
                  onClick={toggleForm}
                >
                  Sign In
                </button>
              </Link>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>
                Register with your personal details to use all site features
              </p>
              <Link to={"/register"}>
                <button
                  className={!isSignIn ? "hidden" : ""}
                  onClick={toggleForm}
                >
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;
