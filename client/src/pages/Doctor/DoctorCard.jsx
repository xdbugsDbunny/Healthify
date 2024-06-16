import React from "react";
import { Card, Col, Row } from "antd";
import "./DoctorCard.css";
import { useNavigate } from "react-router-dom";

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  return (
    <Row gutter={20}>
      <Col span={6}>
        <Card
          title={doctor.firstName + "   " + doctor.lastName}
          bordered={true}
          style={{
            width: 350,
            cursor: "pointer",
            margin: "10px",
          }}
          onClick={() => navigate(`/book-appointment/${doctor._id}`)}
        >
          <p className="card-text">
            <b>Specialization : </b>
            {doctor.specialization}
          </p>
          <p className="card-text">
            <b>Timings : </b> {doctor.timings[0] + " to " + doctor.timings[1]}
          </p>
          <p className="card-text">
            <b>Fee Per Consultation : </b>Rs {doctor.feePerConsultation}/-
          </p>
          <p className="card-text">
            <b>Phone Number : </b>
            {doctor.phone}
          </p>
          <p className="card-text">
            <b>Email : </b>
            {doctor.email}
          </p>
        </Card>
      </Col>
    </Row>
  );
};

export default DoctorCard;
