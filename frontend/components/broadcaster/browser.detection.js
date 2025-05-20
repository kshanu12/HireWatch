import { useState, useEffect } from "react";
import WarningModal from "./warning";
import { updateApplicationById } from "@/method/application";
import { useRouter } from "next/router";
import { updateOneTimePassword } from "@/method/user";

const BrowserDetection = () => {
  const [tabChangeCount, setTabChangeCount] = useState(5);
  const [fullScreenChangeCount, setFullScreenChangeCount] = useState(5);
  const [detectedObject, setDetectedObject] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [screenHeight, setScreenSize] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const router = useRouter();

  const handleFullScreenChange = () => {
    const isFullScreen = () => {
      return (
        screenHeight === window.innerHeight && screenWidth === window.innerWidth
      );
    };

    if (!isFullScreen()) {
      setFullScreenChangeCount(
        (prevFullScreenChangeCount) => prevFullScreenChangeCount - 1
      );
      setShowModal(true);
      setDetectedObject("Warning: Full Screen Change Detected");
      setModalMessage(
        "Enable full screen again to continue. Multiple violations may lead to disqualification"
      );
    }
  };

  const handleKeyPress = (event) => {
    if (event.altKey) {
      event.preventDefault();
    }

    if (event.ctrlKey) {
      event.preventDefault();
    }
  };

  const handleBlurChange = () => {
    setTabChangeCount((prevTabChangeCount) => prevTabChangeCount - 1);
    setDetectedObject("Warning: Tab Switch Detected");

    setModalMessage(
      `Browser Violation Detected. Multiple violations may lead to disqualification`
    );
    setShowModal(true);
  };

  const contextMenuChange = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    if (tabChangeCount > 0 && fullScreenChangeCount > 0) {
      document.addEventListener("contextmenu", contextMenuChange, false);
      document.addEventListener("keydown", handleKeyPress, false);
      window.addEventListener("blur", handleBlurChange);
    }

    return function cleanup() {
      document.removeEventListener("contextmenu", contextMenuChange, false);
      document.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("blur", handleBlurChange);
    };
  }, []);

  useEffect(() => {
    if (screenHeight === 0) {
      setScreenSize(window.innerHeight);
    }

    if (screenWidth === 0) {
      setScreenWidth(window.innerWidth);
    }

    const runFullScreenDetection = setInterval(() => {
      handleFullScreenChange();
    }, 2 * 1000);

    return () => {
      clearInterval(runFullScreenDetection);
    };
  }, [screenHeight, screenWidth]);

  useEffect(() => {
    if (!tabChangeCount || !fullScreenChangeCount) {
      updateApplicationById(router.query.id, 8, 4);
      updateOneTimePassword(router.query.id);
      router.push('1/rejected');
    }
  }, [tabChangeCount, fullScreenChangeCount]);

  const handleOk = () => {
    setShowModal(false);
  };

  return (
    <>
      <WarningModal
        showModal={showModal}
        detectedObject={detectedObject}
        modalMessage={modalMessage}
        handleOk={handleOk}
        handleModalCancel={handleOk}
      />
    </>
  );
};

export default BrowserDetection;
