import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NewLayout from "../../../components/NewLayout/NewLayout";
import "../../../App.css";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/alertReducer";
const UserList = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/v1/admin/list-of-users", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response.data);
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          <Button danger >Block</Button>
        </div>
      ),
    },
  ];

  return (
    <NewLayout>
      <div className="main-wrapper">
        <div className="left-heading">
          <h1>User List</h1>
        </div>
        <div className="wrapper">
          <Table columns={columns} dataSource={users}></Table>
        </div>
      </div>
    </NewLayout>
  );
};

export default UserList;
