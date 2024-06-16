import React, { useEffect, useState } from "react";
import NewLayout from "../../components/NewLayout/NewLayout";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertReducer";
import axios from "axios";
import "./Appointment.css";
import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import moment from "moment";
import toast from "react-hot-toast";
import dayjs from "dayjs";
const BookAppointments = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const { user } = useSelector((state) => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);
  const getDoctor = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/doctor/get-doctor-by-doctor-id",
        {
          doctorId: params.doctorId,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(hideLoading());
      //   console.log(response.data);
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctor();
  }, []);

  const handleTimeChange = (value) => {
    const formattedTime = dayjs(value).format("hh:mm A");
    setIsAvailable(false);
    setSelectedTime(formattedTime);
  };

  const BookNow = async () => {
    setIsAvailable(false);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/users/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: user,
          date: selectedDate,
          selectedTime: selectedTime,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(hideLoading());
      //   console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Something Went Wrong while Booking Appointment");
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
      console.log("Selected Date", selectedDate);
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/users/check-appointment-availability",
        {
          doctorId: params.doctorId,
          date: selectedDate,
          selectedTime: selectedTime,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(hideLoading());
      // console.log(response.data);
      if (response.data.success) {
        setIsAvailable(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Something Went Wrong Checking Appointment");
      dispatch(hideLoading());
    }
  };


  return (
    <NewLayout>
      <div className="main-wrapper">
        <div className="left-heading">
          <h1>Book Your Appointments</h1>
        </div>
        <div className="wrapper">
          {doctor && (
            <>
              <h1 className="color">
                {doctor.firstName} {doctor.lastName}{" "}
              </h1>
              <hr className="color" />
              <h2 className="color"> Timings: </h2>
              <hr className="color" />
              <h4 className="color">
                {doctor.timings[0]} - {doctor.timings[1]}{" "}
              </h4>
              <Row>
                <Col span={12} sm={24} xs={24} lg={8}>
                  <div className="d-flex flex-column pt-2">
                    <DatePicker
                      format="DD-MM-YYYY"
                      onChange={(value) => {
                        setIsAvailable(false);
                        setSelectedDate(dayjs(value).format("DD-MM-YYYY"));
                      }}
                    />
                    {/* <DatePicker
                      format="DD-MM-YYYY"
                      onChange={(value) => {
                        setIsAvailable(false);
                        const formattedDate =
                          dayjs(value).format("DD-MM-YYYY");
                        setSelectedDate(formattedDate);
                        console.log(
                          "Selected Date inside onChange:",
                          formattedDate
                        );
                      }}
                    /> */}
                    <TimePicker
                      format="hh:mm a"
                      className="mt-3"
                      onChange={handleTimeChange}
                    />
                    <Button
                      className="btn btn-info mt-3 full-width-button"
                      onClick={checkAvailability}
                    >
                      Check Availability
                    </Button>

                    {isAvailable && (
                      <Button
                        className="btn btn-info mt-3 full-width-button"
                        onClick={BookNow}
                      >
                        Book Now
                      </Button>
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </NewLayout>
  );
};

export default BookAppointments;
