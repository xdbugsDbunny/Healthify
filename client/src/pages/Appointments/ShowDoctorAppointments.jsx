import React, { useEffect, useState } from "react";
import NewLayout from "../../components/NewLayout/NewLayout";
import "../../App.css";
import axios from "axios";
import { hideLoading, showLoading } from "../../redux/alertReducer";
import { useDispatch, useSelector } from "react-redux";
import { Button, Table } from "antd";
import moment from "moment";
import "./Appointment.css";
import toast from "react-hot-toast";

const ShowDoctorAppointments = () => {
  const [userAppointment, setUserAppointment] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const getAppointments = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/v1/doctor/get-all-appointments-by-doctor-id",
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

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/doctor/change-appointment-status",
        { appointmentId: record._id, status: status },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("Appointment status updated successfully");
      }
    } catch (error) {
      toast.error("Error updating application status");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => <span>{record.userInfo.name}</span>,
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
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "PENDING" && (
            <>
              <Button
                type="primary"
                size="medium"
                style={{ background: "#008000" }}
                onClick={() => changeAppointmentStatus(record, "APPROVED")}
              >
                APPROVED
              </Button>
              &nbsp; &nbsp;
              <Button
                type="primary"
                size="medium"
                danger
                onClick={() => changeAppointmentStatus(record, "REJECTED")}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === "APPROVED" && (
            <Button
              type="primary"
              size="medium"
              //   style={{ background: "#008000" }}
              danger
              onClick={() => changeAppointmentStatus(record, "REJECTED")}
            >
              Reject
            </Button>
          )}
          {record.status === "REJECTED" && (
            <Button
              type="primary"
              size="medium"
              style={{ background: "#008000" }}
              //   danger
              onClick={() => changeAppointmentStatus(record, "APPROVED")}
            >
              Approve
            </Button>
          )}
        </div>
      ),
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

export default ShowDoctorAppointments;
