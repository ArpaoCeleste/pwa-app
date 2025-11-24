import React, { useState } from "react";
import styles from "./styles.module.scss";
import { Row, Col, Container } from "reactstrap";
import LoginForm from "../LoginForm";
import QrRead from "../QrcodeRead";
const HomePage = () => {
  const [showQRCode, setQrCode] = useState(false);
  const [dataQrCode, setDataQrCode] = useState({});
  return (
    <Container>
      <Row className={styles.row}>
        <Col className={styles.col}>
          <LoginForm title="Admin" role="admin" />
        </Col>
        <Col>
          <LoginForm title="User" role="user" data={dataQrCode} />
          <div className={styles.qrContainer}>
            {showQRCode && <QrRead setDataLogin={setDataQrCode} />}
            {
              <button onClick={() => setQrCode(!showQRCode)}>
                Login with QrCode
              </button>
            }
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default HomePage;