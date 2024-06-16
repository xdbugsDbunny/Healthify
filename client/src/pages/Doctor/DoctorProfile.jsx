import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  TimePicker,
  DatePicker,
  Upload,
  Button,
} from "antd";
import axios from "axios";
import NewLayout from "../../components/NewLayout/NewLayout";
import "../ApplyDoctor/ApplyDoctor.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertReducer";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

const DoctorProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [fetchedTimings, setFetchedTimings] = useState();

  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    address: "",
    experience: "",
    feePerConsultation: "",
    timings: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value,
    });
  };

  const handleTimingsChange = (time, timeString) => {
    const convertedTimings12Hour = timeString.map((t) =>
      moment(t, "HH:mm a").format("hh:mm a")
    );
    setDoctorData((prevState) => ({
      ...prevState,
      timings: convertedTimings12Hour,
    }));
  };

  const getDoctor = async () => {
    try {
      const response = await axios.post(
        "/api/v1/doctor/get-doctor-by-id",
        {
          userId: params.doctorId,
        },
        {
          withCredentials: true,
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        const data = response.data.data;
        setFetchedTimings(response.data.data.timings);
        setDoctorData({
          firstName: data.firstName,
          lastName: data.lastName,
          specialization: data.specialization,
          address: data.address,
          experience: data.experience,
          feePerConsultation: data.feePerConsultation,
        });
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctor();
  }, []);

  const handleSubmit = async () => {
    try {
      dispatch(showLoading());
      console.log(doctorData);
      const response = await axios.post(
        "/api/v1/doctor/update-doctor-profile",
        { ...doctorData, userId: params?.doctorId },
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
        console.log(doctorData);
        navigate("/home");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  return (
    <NewLayout>
      <div className="main-wrapper">
        <div className="left-heading">
          <h1>Apply Doctor</h1>
        </div>
        <div className="wrapper">
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={doctorData}
          >
            <h5 className="card-title">Personal Information</h5>
            <Row gutter={30}>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item label="First Name" rules={[{ required: true }]}>
                  <Input
                    placeholder="First Name"
                    name="firstName"
                    value={doctorData.firstName}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item label="Last Name" rules={[{ required: true }]}>
                  <Input
                    placeholder="Last Name"
                    name="lastName"
                    value={doctorData.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item label="Specialization" rules={[{ required: true }]}>
                  <Input
                    placeholder="Specialization"
                    name="specialization"
                    value={doctorData.specialization}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item label="Address" rules={[{ required: true }]}>
                  <Input
                    placeholder="Address"
                    name="address"
                    value={doctorData.address}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item label="Experience" rules={[{ required: true }]}>
                  <Input
                    placeholder="Experience"
                    name="experience"
                    value={doctorData.experience}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Fee Per Consultation"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Fee Per Consultation"
                    name="feePerConsultation"
                    value={doctorData.feePerConsultation}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Timings"
                  rules={[
                    { required: true, message: "Please select the timings!" },
                  ]}
                >
                  <p className="timings">
                    Old Timing : {fetchedTimings && fetchedTimings[0]} to{" "}
                    {fetchedTimings && fetchedTimings[1]}
                  </p>
                  <TimePicker.RangePicker
                    format="h:mm a"
                    name="timings"
                    value={doctorData?.timings?.map((t) =>
                      moment(t, "hh:mm a")
                    )}
                    onChange={handleTimingsChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
          <h4 className="error-message">
            * Documents are not allowed to edit.
          </h4>
        </div>
      </div>
    </NewLayout>
  );
};

export default DoctorProfile;
