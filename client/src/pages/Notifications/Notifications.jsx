import { Button, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NewLayout from "../../components/NewLayout/NewLayout";
import "../../App.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertReducer";
import "./Notifications.css";
import { setUser } from "../../redux/userReducer";

const Notifications = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/users/mark-notifications-all-as-seen",
        { userId: user._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      dispatch(hideLoading());
    }
  };

  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/v1/users/delete-all-notifications",
        { userId: user._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  return (
    <NewLayout>
      <div className="main-wrapper">
        <div className="left-heading">
          <h1>Notifications</h1>
        </div>
        <div className="wrapper">
          <Tabs>
            <Tabs.TabPane tab="Unseen" key={0}>
              <div className="d-flex justify-content-end">
                <div className="anchor" onClick={markAllAsSeen}>
                  Mark All As Seen
                </div>
              </div>
              {user?.unseenNotifications?.length > 0 ? (
                user.unseenNotifications.map((notification, index) => (
                  <div
                    className="card p-2"
                    onClick={() => navigate(notification.onClickPath)}
                    key={index}
                  >
                    <div className="card-text">{notification.message}</div>
                  </div>
                ))
              ) : (
                <div className="notification-message">
                  No unseen notifications
                </div>
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Seen" key={1}>
              <div className="d-flex justify-content-end">
                <div className="anchor" onClick={deleteAll}>
                  Delete All
                </div>
              </div>
              {user?.seenNotifications?.length > 0 ? (
                user.seenNotifications.map((notification, index) => (
                  <div
                    className="card p-2"
                    onClick={() => navigate(notification.onClickPath)}
                    key={index}
                  >
                    <div className="card-text">{notification.message}</div>
                  </div>
                ))
              ) : (
                <div className="notification-message">
                  No seen notifications
                </div>
              )}
            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    </NewLayout>
  );
};

export default Notifications;
