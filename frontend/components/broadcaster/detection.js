import React from "react";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as posenet from "@tensorflow-models/posenet";
import styles from "./detection.module.css";
import WarningModal from "./warning";
import { addViolationByApplicationId } from "@/method/violation";

export default class Detection extends React.Component {
  videoRef = React.createRef();
  canvasRef = React.createRef();

  proctorModalWarnings = [
    {
      title: "Warning: Face Not Detected",
      message:
        "Your face was not detected in the webcam. Ensure your face is \
                clearly visible! Multiple warnings may lead to  disqualification.",
    },
    {
      title: "Warning: Attention Required",
      message:
        "You were looking away from the screen. Ensure you're looking \
                towards the screen at all times. Multiple warnings may lead to \
                disqualification.",
    },
    {
      title: "Warning: Mobile Phone Detected",
      message:
        "A Mobile Phone was detected in your camera frame. This is \
                strictly prohibited and may lead to disqualification.",
    },
    {
      title: "Warning: Prohibited Object Detected",
      message:
        "A prohibited object was detected in your camera frame. Multiple \
                warnings may lead to disqualification.",
    },
    {
      title: "Warning: Multiple Person Detected",
      message:
        "Multiple people were detected in your camera frame. This is \
                strictly prohibited and may lead to disqualification.",
    },
  ];

  constructor(props) {
    super(props);

    /**
     * personNotDetected: stores the count of frames until a person is detected
     * (handles person not visible)
     * showModal: toggle the modal
     * detectedObject: stores the detected object for rendering on modal
     * multipleFacesDetected: keeps track of whether multiple faces are present
     * in the videoRef
     * cellPhoneDetected: keeps track of whether a cell phone is present in the
     * videoRef
     * prohibitedObjectDetected: keeps track of whether prohibited objects are
     * present in the videoRef
     * faceNotDetected: keeps track of whether a face is visible in the videoRef
     * leftEarNotVisible: keeps track of whether the left ear is not visible
     * rightEarNotVisible: keeps track of whether the right ear is not visible
     */

    this.state = {
      personNotDetected: 0,
      showModal: false,
      modalMessage: "",
      detectedObject: "",
      image: "",

      multipleFacesDetected: false,
      cellPhoneDetected: false,
      prohibitedObjectDetected: false,
      faceNotDetected: false,
      leftEarNotVisible: false,
      rightEarNotVisible: false,
    };
  }

  /**
   * ``componentDidMount`` runs when the component is first loaded
   * Setting up webcam input, loading TensorFlow models and calling
   * detection functions which is recursive so that it keeps detecting
   * throughout the stream
   */
  async componentDidMount() {
    // Check if the browser supports getUserMedia API
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: 800,
            height: 400,
          },
        })
        .then((stream) => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;

          // Create a promise that resolves when the video metadata is loaded
          return new Promise((resolve, reject) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        })
        .catch((error) => {
          // console.log(`detection( componentDidMount ) error: ${error.message}`);
        });

      // load model after 5s delay (should fix [0x0] texture invalid issue)
      setTimeout(async () => {
        const objectModelPromise = cocoSsd.load(); // load coco-ssd object detection model
        const poseNetModelPromise = await posenet.load(); // load posenet model

        Promise.all([objectModelPromise, poseNetModelPromise, webCamPromise])
          .then((values) => {
            // Start detection using the loaded models
            this.objectModelDetection(this.props.videoRef.current, values[0]);
            this.poseNetModelDetection(this.props.videoRef.current, values[1]);
          })
          .catch((error) => {
            console.error(`detection( componentDidMount ): ${error}`);
          });
      }, 5 * 1000);
    }
  }

  /**
   *
   * Use the model to estimate poses in the frame, pass the predictions to the
   * ``renderPoseNetPredictions`` within intervals of 5s
   * @param {videoRef} video
   * @param {poseNetModelPromise} model
   */
  poseNetModelDetection = (video, model) => {
    setInterval(async () => {
      const pose = await model.estimateSinglePose(video);
      this.renderPoseNetPredictions(video, pose["keypoints"], 0.1);
    }, 5 * 1000);
  };

  /**
   * Apply custom threshold detection to the frame and record if any violation
   * is found
   * @param {videoRef} video
   * @param {object} keypoint
   * @param {float} minConfidence
   */
  renderPoseNetPredictions = (video, keypoint, minConfidence) => {
    const leftEarScore = keypoint[3].score;
    const rightEarScore = keypoint[4].score;
    // console.log("EAR", leftEarScore, rightEarScore);

    if (leftEarScore < minConfidence && rightEarScore < minConfidence) {
      if (!this.state.faceNotDetected) this.captureViolation(video);
      this.setState({
        showModal: true,
        detectedObject: this.proctorModalWarnings[0].title,
        modalMessage: this.proctorModalWarnings[0].message,
        faceNotDetected: true,
      });
    } else if (leftEarScore < minConfidence) {
      if (!this.state.leftEarNotVisible) {
        this.captureViolation(video);
      }

      this.setState({
        showModal: true,
        detectedObject: this.proctorModalWarnings[1].title,
        modalMessage: this.proctorModalWarnings[1].message,
        leftEarNotVisible: true,
      });
    } else if (rightEarScore < minConfidence) {
      if (!this.state.leftEarNotVisible) {
        this.captureViolation(video);
      }

      this.setState({
        showModal: true,
        detectedObject: this.proctorModalWarnings[1].title,
        modalMessage: this.proctorModalWarnings[1].message,
        rightEarNotVisible: true,
      });
    }
  };

  /**
   *
   * Use the model to detect objects in the frame, pass the predictions to the
   * ``renderObjectPredictions`` function then recursively call it again
   * @param {videoRef} video
   * @param {objectModel} model
   */
  objectModelDetection = (video, model) => {
    model.detect(video).then((predictions) => {
      if (this.canvasRef.current) {
        this.renderObjectPredictions(video, predictions);

        requestAnimationFrame(() => {
          this.objectModelDetection(video, model);
        });
      } else return false;
    });
  };

  /**
   * Performs object detection based off the predictions from the model and
   * render them as per our requirements. Usually, we show a modal window with
   * the violation i.e. detected object. Additionally, we also record the
   * violation as image and save it for later use.
   *
   * @param {videoRef} video
   * @param {array} predictions
   */
  renderObjectPredictions = (video, predictions) => {
    //this.drawObjectPredictionsOnCanvas(predictions);

    var faces = 0;

    predictions.forEach((prediction) => {
      if (prediction.class == "cell phone") {
        // this.props.MobilePhone(); uncomment if required

        if (!this.state.cellPhoneDetected) this.captureViolation(video);

        this.setState({
          showModal: true,
          detectedObject: this.proctorModalWarnings[2].title,
          modalMessage: this.proctorModalWarnings[2].message,
          cellPhoneDetected: true,
        });
      }

      if (prediction.class == "book" || prediction.class === "laptop") {
        if (!this.state.prohibitedObjectDetected) {
          this.captureViolation(video);
        }

        //this.props.ProhibitedObject(); uncomment if required
        this.setState({
          showModal: true,
          detectedObject: this.proctorModalWarnings[3].title,
          modalMessage: this.proctorModalWarnings[3].message,
          prohibitedObjectDetected: true,
        });
      }
      if (prediction.class == "person") {
        faces += 1;
        this.setState({
          personNotDetected: 0,
          faceNotDetected: false,
        });
      }
    });

    if (faces > 1) {
      if (!this.state.multipleFacesDetected) {
        this.captureViolation(video);
      }

      this.setState({
        showModal: true,
        detectedObject: this.proctorModalWarnings[4].title,
        modalMessage: this.proctorModalWarnings[4].message,
        multipleFacesDetected: true,
      });
    }
  };

  /**
   *
   * Save the violation to the disk for now. Later save it to a database as blob
   * @param {image} image
   */
  saveImage = (image) => {
    const link = document.createElement("a");
    link.href = image.src;
    link.download = "sreenshot.jpg";
    link.click();
  };

  /**
   * Grab the frame where violation was detected and saves it to the disk
   * @param {videoRef} video
   */
  captureViolation = (video) => {
    if (this.canvasRef) {
      const context = this.canvasRef.current.getContext("2d");
      this.canvasRef.current.width = video.videoWidth;
      this.canvasRef.current.height = video.videoHeight;
      context.drawImage(
        video,
        0,
        0,
        this.canvasRef.current.width,
        this.canvasRef.current.height
      );

      const image = new Image();
      // get the base64 of the image
      this.image = this.canvasRef.current.toDataURL("image/jpeg");
      //addViolationByApplicationId(1, this.detectedObject, image.src);
    }
  };

  /**
   * Draw the object predictions on the canvas
   * @param {array} predictions
   */
  drawObjectPredictionsOnCanvas = (predictions) => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.font = "16px sans-serif";
    ctx.textBaseline = "top";

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];

      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt("16px sans-serif", 10);
      ctx.fillRect(x, y, textWidth + 8, textHeight + 8);
    });

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      ctx.fillStyle = "#000000";

      if (
        prediction.class === "person" ||
        prediction.class === "cell phone" ||
        prediction.class === "book" ||
        prediction.class === "laptop"
      ) {
        ctx.fillText(prediction.class, x, y);
      }
    });
  };

  /**
   * Handles the event of clicking `ok` on the modal window
   */
  handleOk = () => {
    addViolationByApplicationId(
      this.props.applicationID,
      this.state.detectedObject.split(":")[1],
      this.image
    );
    this.setState({
      showModal: false,
      cellPhoneDetected: false,
      prohibitedObjectDetected: false,
      faceNotDetected: false,
      leftEarNotVisible: false,
      rightEarNotVisible: false,
      image: "",
    });
  };

  /**
   * Handles the event of clicking `cancel` on the modal window
   */
  // handleCancel = () => {
  //   addViolationByApplicationId(1, this.state.detectedObject.split(' ')[1], this.state.image);
  //   this.setState({
  //     showModal: false,
  //     cellPhoneDetected: false,
  //     prohibitedObjectDetected: false,
  //     faceNotDetected: false,
  //     leftEarNotVisible: false,
  //     rightEarNotVisible: false,
  //   });
  // };

  render() {
    const { showModal, detectedObject, modalMessage } = this.state;

    return (
      <div>
        <video
          className={styles.size}
          style={{ display: "none" }}
          autoPlay
          playsInline
          muted
          ref={this.videoRef}
          width="1"
          height="1"
        />
        <canvas
          className={styles.size}
          style={{ display: "none" }}
          ref={this.canvasRef}
          width="1"
          height="1"
        />
        <WarningModal
          showModal={showModal}
          detectedObject={detectedObject}
          modalMessage={modalMessage}
          handleOk={this.handleOk}
          handleModalCancel={this.handleCancel}
        />
      </div>
    );
  }
}