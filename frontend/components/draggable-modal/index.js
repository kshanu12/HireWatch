import { Button, Modal } from "antd";
import { React, useRef, useState } from "react";
import Draggable from "react-draggable";

const DraggableModal = (props) => {
  // const [open, setOpen] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });
  const draggleRef = useRef(null);

  const disableProctorMediaStream = () => {
    if (props.proctorVideoRef) {
      const tracks = props.proctorVideoRef.getTracks();
      tracks.forEach((track) => track.stop());
      props.setProctorVideoRef(null);
      props.setShowVideo(false);
    }
  };

  const handleOk = (e) => {
    props.setOpen(false);
    disableProctorMediaStream();
  };

  const handleCancel = (e) => {
    props.setOpen(false);
    disableProctorMediaStream();
  };

  const onStart = (_event, uiData) => {
    const { clientWidth, clientHeight } = window.document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    });
  };

  const footerContent = (
    <div style={{ textAlign: "center" }}>
      <Button key="submit" type="primary" onClick={handleOk}>
        Ok
      </Button>
    </div>
  );

  return (
    <>
      <Modal
        title={
          <div
            style={{
              width: "100%",
              cursor: "move",
            }}
            onMouseOver={() => {
              if (disabled) {
                setDisabled(false);
              }
            }}
            onMouseOut={() => {
              setDisabled(true);
            }}
            onFocus={() => {}}
            onBlur={() => {}}
          >
            {props.title}
          </div>
        }
        open={props.open}
        onOk={handleOk}
        footer={footerContent}
        modalRender={(modal) => (
          <Draggable
            disabled={disabled}
            bounds={bounds}
            onStart={(event, uiData) => onStart(event, uiData)}
          >
            <div ref={draggleRef}>{modal}</div>
          </Draggable>
        )}
      >
        {props.content}
      </Modal>
    </>
  );
};
export default DraggableModal;
