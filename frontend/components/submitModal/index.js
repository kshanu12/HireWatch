import React from 'react';
import { Modal } from 'antd';
import styles from './submitModal.module.css';

const SubmitModal = ({ isOpen, onClose, onConfirm }) => {

  return (
    <Modal
      className={styles.modal}
      open={isOpen}
      title={<h2>Confirm Submit</h2>}
      onCancel={onClose}
      footer={[
        <div className={styles.button} key="buttons">
          <button className={styles.cancel} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.submit} type="primary" onClick={onConfirm}>
            Yes, Submit
          </button>
        </div>
      ]}
    >
      <p className={styles.message}>Are you sure you want to submit the test?</p>
    </Modal>
  );
};

export default SubmitModal;
