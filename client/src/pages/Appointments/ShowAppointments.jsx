import React, { useEffect, useState } from "react";
import NewLayout from "../../components/NewLayout/NewLayout";
import "../../App.css";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertReducer";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "antd";
import moment from "moment";
import "./Appointment.css";

const ShowAppointments = () => {
  const [userAppointment, setUserAppointment] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getAppointments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/users/get-all-appointments-by-user-id",
        {
          userId: user._id,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setUserAppointment(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Docor",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.doctorInfo.firstName} {record.doctorInfo.lastName}
        </span>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      render: (text, record) => <span>{record.doctorInfo.address}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <span>{moment(record.date).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      title: "Timing",
      dataIndex: "selectedTime",
      render: (text, record) => (
        <span>{moment(record.selectedTime).format("hh:mm a")}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <NewLayout>
      <div className="main-wrapper">
        <div className="left-heading">
          <h1>Your Appointments</h1>
        </div>
        <div className="wrapper">
          <Table columns={columns} dataSource={userAppointment}></Table>
        </div>
      </div>
    </NewLayout>
  );
};

export default ShowAppointments;
