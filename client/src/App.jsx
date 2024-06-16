import { useState } from "react";
import { Button, Flex } from "antd";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginAndRegister from "./pages/LoginAndRegister/LoginAndRegister";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";
import "./App.css";
import { useSelector } from "react-redux";
import ProtectedRoutes from "./components/ProtectedRoutes";
import PublicRoutes from "./components/PublicRoutes";
import "remixicon/fonts/remixicon.css";
import ApplyDoctor from "./pages/ApplyDoctor/ApplyDoctor";
import Profile from "./pages/Profile/Profile";
import Date from "./components/Date";
import DoctorList from "./pages/Admin/DoctorList/DoctorList";
import UserList from "./pages/Admin/UserList/UserList";
import Notifications from "./pages/Notifications/Notifications";
import DoctorProfile from "./pages/Doctor/DoctorProfile";
import ShowAppointments from "./pages/Appointments/ShowAppointments";
import BookAppointments from "./pages/Appointments/BookAppointments";
import ShowDoctorAppointments from "./pages/Appointments/ShowDoctorAppointments";
function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <BrowserRouter>
      {loading && (
        <div className="spinner-parent">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoutes>
              <ShowAppointments />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/apply-doctor"
          element={
            <ProtectedRoutes>
              <ApplyDoctor />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/list-of-doctors"
          element={
            <ProtectedRoutes>
              <DoctorList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/admin/list-of-users"
          element={
            <ProtectedRoutes>
              <UserList />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoutes>
              <Notifications />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <LoginAndRegister />
            </PublicRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoutes>
              <LoginAndRegister />
            </PublicRoutes>
          }
        />
        <Route
          path="/date"
          element={
            <ProtectedRoutes>
              <Date />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/doctor/profile/:doctorId"
          element={
            <ProtectedRoutes>
              <DoctorProfile />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoutes>
              <BookAppointments />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoutes>
              <ShowDoctorAppointments />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
