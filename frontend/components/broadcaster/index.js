import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

import Video from "../../components/video";
import Detection from "./detection";
import BrowserDetection from "./browser.detection";
import { useSocket } from "@/context/socket.provider";
import { updateApplicationBroadcasterId } from "@/method/application";

const Broadcaster = () => {
  const router = useRouter();
  const peerInstance = useRef(null);
  const videoRef = useRef(null);
  const socketRef = useSocket();

  const getUserMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          height: 300,
          width: 375,
        },
      });

      videoRef.current.srcObject = stream;
      // console.log("Video Loaded");

      // // workaround for https://github.com/tensorflow/tfjs/issues/322
      // const videoWidth = videoRef.current.srcObject.videoWidth;
      // const videoHeight = videoRef.current.srcObject.videoHeight;
      // videoRef.current.width = videoWidth;
      // videoRef.current.height = videoHeight;
    } catch (error) {
      alert("Camera Permission Required");
    }
  };

  const updateApplication = async (router_id, broad_id) => {
    await updateApplicationBroadcasterId(router_id, broad_id);
  };

  useEffect(() => {
    getUserMedia();

    import("peerjs").then(({ default: Peer }) => {
      peerInstance.current = new Peer({ debug: 3 });

      // TODO: modify the broadcaster id to be dynamic
      peerInstance.current.on("open", (id) => {
        // console.log("candidate-emit-socket-event");
        socketRef.emit("refresh-change");
        updateApplication(router.query.id, id);

        peerInstance.current.on("call", (call) => {
          call.answer(stream);
        });
      });
    });
  }, []);

  return (
    <>
      <Video video={videoRef}></Video>
      <Detection applicationID={router.query.id} videoRef={videoRef} />
      <BrowserDetection />
    </>
  );
};

export default Broadcaster;
