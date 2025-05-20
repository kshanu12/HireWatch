import React from "react";
import { Modal, Button } from "antd";
import styles from "./warning.module.css"

const WarningModal = ({
  showModal,
  detectedObject,
  modalMessage,
  handleOk,
  handleModalCancel,
}) => {
  return (
    <Modal 
      title={<span style={{ color: "red" }}>{detectedObject}</span>}
      open={showModal}
      onOk={handleOk}
      onCancel={handleModalCancel}
      height = { 440 }
      width = { 450 }
      wrapClassName={styles.centerModal}
      footer={[
        <Button className={styles.centerButton} key="ok" type="primary" onClick={handleOk}>
          Ok
        </Button>,
      ]}
    >
      <p>{modalMessage}</p>
    </Modal>
  );
};

export default WarningModal;