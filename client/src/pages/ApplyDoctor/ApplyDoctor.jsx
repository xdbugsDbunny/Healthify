import React, { useState } from "react";
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
import "./ApplyDoctor.css";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../../redux/alertReducer";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ApplyDoctor = () => {
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <i className="bx bx-upload"></i>
    </button>
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dateFormatList = ["YYYY-MM-DD"];
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    specialization: "",
    certificateName: "",
    certificateNumber: "",
    issuedBy: "",
    issueDate: null,
    documentFile: "",
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

  const handleDateChange = (date, dateString) => {
    setDoctorData({
      ...doctorData,
      issueDate: date ? dayjs(date).format(dateFormatList[0]) : null, // Using dayjs to format the date
    });
  };

  const beforeUpload = (file) => {
    setFileList([...fileList, file]);
    return false;
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList.length > 0) {
      setDoctorData({
        ...doctorData,
        documentFile: newFileList[0].originFileObj,
      });
    }
  };

  const resetForm = () => {
    setDoctorData({
      firstName: "",
      lastName: "",
      specialization: "",
      certificateName: "",
      certificateNumber: "",
      issuedBy: "",
      issueDate: null,
      documentFile: "",
      address: "",
      experience: "",
      feePerConsultation: "",
      timings: [],
    });
    setFileList([]);
  };

  const handleSubmit = async () => {
    try {
      dispatch(showLoading());
      console.log(doctorData);
      // const response = await axios.post(
      //   "/api/v1/users/apply-doctor",
      //   { ...doctorData, userId: user._id },
      //   {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //     withCredentials: true,
      //   }
      // );
      // dispatch(hideLoading());
      // if (response.data.success) {
      //   toast.success(response.data.message);
      //   // resetForm();
      //   // navigate("/home");
      // } else {
      //   toast.error(response.data.message);
      // }
    } catch (error) {
      dispatch(hideLoading());
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  return (
    <NewLayout>
      <div className="main-wrapper">
        <div className="left-heading">
          <h1>Apply Doctor</h1>
        </div>
        <div className="wrapper">
          <Form layout="vertical" onFinish={handleSubmit}>
            <h5 className="card-title">Personal Information</h5>
            <Row gutter={30}>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="First Name"
                    name="firstName"
                    value={doctorData.firstName}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Last Name"
                  rules={[{ required: true }]}
                  name="lastName"
                  value={doctorData.lastName}
                  onChange={handleInputChange}
                >
                  <Input
                    placeholder="Last Name"
                    name="lastName"
                    value={doctorData.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Specialization"
                  name="specialization"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Specialization"
                    name="specialization"
                    value={doctorData.specialization}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Address"
                  name="address"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Address"
                    name="address"
                    value={doctorData.address}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Experience"
                  name="experience"
                  rules={[{ required: true }]}
                >
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
                  name="feePerConsultation"
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
                  name="timings"
                  rules={[
                    { required: true, message: "Please select the timings!" },
                  ]}
                >
                  <TimePicker.RangePicker
                    format="hh:mm a"
                    name="timings"
                    value={doctorData.timings.map((t) => moment(t, "hh:mm a"))} // Convert stored timings to moment objects for display
                    onChange={handleTimingsChange}
                  />
                </Form.Item>
              </Col>
            </Row>
            <h5 className="card-title">Certificate Information</h5>
            <Row gutter={30}>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Certificate Name"
                  name="certificateName"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Certificate Name"
                    name="certificateName"
                    value={doctorData.certificateName}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Certificate Number"
                  name="certificateNumber"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Certificate Number"
                    name="certificateNumber"
                    value={doctorData.certificateNumber}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Issued By"
                  name="issuedBy"
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder="Issued By"
                    name="issuedBy"
                    value={doctorData.issuedBy}
                    onChange={handleInputChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Issue Date"
                  name="issueDate"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    name="issueDate"
                    initialValues={dayjs("01/01/1998", dateFormatList[0])}
                    format={dateFormatList}
                    value={
                      doctorData.issueDate
                        ? dayjs(doctorData.issueDate, dateFormatList[0])
                        : null
                    }
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </Col>
              <Col span={8} xs={24} sm={24} lg={8}>
                <Form.Item
                  label="Upload Certificate"
                  rules={[{ required: true }]}
                  name="documentFile"
                >
                  <Upload
                    listType="picture-circle"
                    fileList={fileList}
                    name="documentFile"
                    value={doctorData.documentFile}
                    onChange={handleUploadChange}
                    beforeUpload={beforeUpload}
                    showUploadList={{
                      showPreviewIcon: false,
                    }}
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </NewLayout>
  );
};

export default ApplyDoctor;
