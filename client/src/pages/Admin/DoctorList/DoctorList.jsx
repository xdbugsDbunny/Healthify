import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/alertReducer";
import NewLayout from "../../../components/NewLayout/NewLayout";
import "../../../App.css";
import "./DoctorList.css"
import toast from "react-hot-toast";


const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/admin/list-of-doctors", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching users:", error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const changeApplicationStatus = async (record, applicationStatus) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "http://localhost:8000/api/v1/admin/change-application-status",
        { doctorId: record._id, applicationStatus, userId: record.userId },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Response Data:", response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("Application status updated successfully");
        getDoctorsData();
      }
    } catch (error) {
      console.log("Error updating application status:", error.response.data);
      toast.error("Error updating application status");
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <h6>
          {record.firstName} {record.lastName}
        </h6>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
    },
    {
      title: "Experience",
      dataIndex: "experience",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Application Status",
      dataIndex: "applicationStatus",
    },
    {
      title: "Certificate",
      dataIndex: "documentFile",
      render: (text, record) => (
        <div className="d-flex">
          <Button
            type="primary"
            size="medium"
            onClick={() => window.open(record.documentFile, "_blank")}
          >
            Download File
          </Button>
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.applicationStatus === "PENDING" && (
            <>
              <Button
                type="primary"
                size="medium"
                style={{ background: "#008000" }}
                onClick={() => changeApplicationStatus(record, "VERIFYING")}
              >
                Verify
              </Button>
            </>
          )}
          {record.applicationStatus === "VERIFYING" && (
            <>
              <Button
                type="primary"
                size="medium"
                style={{ background: "#008000" }}
                onClick={() => changeApplicationStatus(record, "APPROVED")}
              >
                Approve
              </Button>
              &nbsp; &nbsp;
              <Button
                type="primary"
                size="medium"
                danger
                onClick={() => changeApplicationStatus(record, "REJECTED")}
              >
                Reject
              </Button>
            </>
          )}
          {record.applicationStatus === "APPROVED" && (
            <Button
              type="primary"
              danger
              onClick={() => changeApplicationStatus(record, "BLOCKED")}
            >
              Block
            </Button>
          )}
          {record.applicationStatus === "REJECTED" && (
            <Button
              type="primary"
              size="medium"
              style={{ background: "#008000" }}
              onClick={() => changeApplicationStatus(record, "APPROVED")}
            >
              Approve
            </Button>
          )}
          {record.applicationStatus === "BLOCKED" && (
            <Button
              type="primary"
              size="medium"
              style={{ background: "#008000" }}
              onClick={() => changeApplicationStatus(record, "VERIFYING")}
            >
              UNBLOCK
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
          <h1>Doctor List</h1>
        </div>
        <div className="wrapper">
          <Table columns={columns} dataSource={doctors} rowHoverable={false}></Table>
        </div>
      </div>
    </NewLayout>
  );
};

export default DoctorList;
