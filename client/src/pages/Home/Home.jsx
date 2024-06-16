import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NewLayout from "../../components/NewLayout/NewLayout";
import "../../App.css";
import "./Home.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertReducer";
import DoctorCard from "../Doctor/DoctorCard";

const Home = () => {
  const dispatch = useDispatch();
  const [doctors, setDoctors] = useState([]);

  const getApprovedDoctors = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/v1/users/get-all-approved-doctors",
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("API response is not an array:", response.data);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error("Error fetching approved doctors:", error);
      toast.error("Failed to fetch doctors. Please try again.");
    }
  };

  useEffect(() => {
    getApprovedDoctors();
    // console.log(doctors);
  }, []);

  return (
    <NewLayout>
      <div className="main-wrapper">
        <div className="left-heading">
          <h1>Home</h1>
        </div>
        <div className="wrapper">
          <Row gutter={20}>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((doctor) => (
                <Col key={doctor._id} span={8} xs={24} sm={24} lg={8}>
                  <DoctorCard doctor={doctor} />
                </Col>
              ))
            ) : (
              <p className="doctor-message">No doctors found</p>
            )}
          </Row>
        </div>
      </div>
    </NewLayout>
  );
};

export default Home;
