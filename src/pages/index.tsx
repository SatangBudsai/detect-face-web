import { Fragment, MutableRefObject, ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import RootLayout from "@/layouts/root-layout";
import MainLayout from "@/layouts/main-layout";
import { DateRange } from "react-day-picker";
import Alert from "@/components/alert";
import { Button, Input, Image, cn } from "@nextui-org/react";
import apiBase from "@/api/base";
import useLoaderGlobal from "@/hooks/useLoaderGlobal";
import DatePicker from "@/components/date-picker";
import DateMultiplePicker from "@/components/date-multiple-picker";
import DateRangePicker from "@/components/date-range-picker";
import Container from "@/components/container";

import Webcam from "react-webcam";
import { CameraOptions, useFaceDetection } from "react-use-face-detection";
import FaceDetection from "@mediapipe/face_detection";
import { Camera } from "@mediapipe/camera_utils";
import { Icon } from "@iconify/react/dist/iconify.js";

type Props = {};

const width = 300;
const height = 300;

const Home = (props: Props) => {
  const loaderGlobal = useLoaderGlobal();
  const [img, setImg] = useState<string[]>([]);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const { webcamRef, boundingBox, isLoading, detected, facesDetected } =
    useFaceDetection({
      faceDetectionOptions: {
        model: "short",
      },
      faceDetection: new FaceDetection.FaceDetection({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
      }),
      camera: ({ mediaSrc, onFrame }: CameraOptions) =>
        new Camera(mediaSrc, {
          onFrame,
          width,
          height,
          facingMode: "user",
        }),
    });

  const capture = () => {
    const imageSrc = webcamRef?.valueOf() as MutableRefObject<Webcam | undefined>;
    const captureImage = imageSrc.current?.getScreenshot()
    if (captureImage) {
      console.log("img", img);

      const arrImg = [...img, captureImage];
      setImg(arrImg);
    }
  };

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');
    setDevices(videoDevices);
  };

  useEffect(() => {
    getDevices();
  }, []);

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDevice(event.target.value);
  };

  // console.log("img", img);
  // console.log("webcamRef", webcamRef?.current);
  // console.log("facesDetected", facesDetected);
  // console.log("imgRef", imgRef);
  // console.log("boundingBox", boundingBox);

  return (
    <Fragment>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-center gap-5 text-4xl font-bold uppercase">
          Detect Face Website
        </div>
        <Container className="flex flex-col items-center justify-center gap-10">
          <div className="flex gap-5">
            <div style={{ width, height, position: "relative" }}>
              {boundingBox.map((box, index) => (
                <div
                  key={`${index + 1}`}
                  style={{
                    position: "absolute",
                    top: `${box.yCenter * 100}%`,
                    left: `${box.xCenter * 100}%`,
                    width: `${box.width * 100}%`,
                    height: `${box.height * 100}%`,
                    zIndex: 1,
                  }}
                >
                  <div
                    className={cn(
                      "border-2 shadow-lg  rounded-xl h-full w-full",
                      box.height >= 0.4
                        ? box.yCenter >= 0.28 &&
                          box.yCenter <= 0.5 &&
                          box.xCenter >= 0.25 &&
                          box.xCenter <= 0.4
                          ? "border-success shadow-success"
                          : "border-warning shadow-warning"
                        : "border-danger shadow-danger"
                    )}
                  ></div>
                  <div className="mt-2">
                    {box.height >= 0.4 ? (
                      box.yCenter >= 0.28 &&
                        box.yCenter <= 0.5 &&
                        box.xCenter >= 0.25 &&
                        box.xCenter <= 0.4 ? (
                        <div className="text-xs text-success text-nowrap">
                          กรุณาค้างไว้ 3 วินาที
                        </div>
                      ) : (
                        <div className="text-xs text-warning text-nowrap">
                          กรุณาขยับให้อยู่ตรงกลาง
                        </div>
                      )
                    ) : (
                      <div className="text-xs text-danger text-nowrap">
                        อยู่ห่างเกินไป
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {selectedDevice && (
                <Webcam
                  ref={webcamRef}
                  width={width}
                  height={height}
                  forceScreenshotSourceSize
                  // videoConstraints={{
                  //   deviceId: selectedDevice,
                  //   width,
                  //   height
                  // }}
                  className="object-cover p-0 rounded-xl drop-shadow-xl"
                />
              )}
            </div>
            <div className="p-2 border-2 rounded-lg min-w-52">
              <p className="text-lg font-medium">ค่าการตรวจจับ</p>
              {boundingBox.map((item, index) => (
                <div key={index} className="w-full p-2 border-b-2">
                  <div>size : {item.height.toFixed(2)}</div>
                  <div>xCenter : {item.xCenter.toFixed(2)}</div>
                  <div>yCenter : {item.yCenter.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <select value={selectedDevice || ''} onChange={handleDeviceChange}>
              <option value="">Select a camera</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full max-w-[30rem]">
            <p>{`Loading: ${isLoading}`}</p>
            <p>{`พบเจอใบหน้า: ${detected}`}</p>
            <div className="flex items-center justify-between ">
              <p className="text-2xl font-bold text-warning">{`จำนวนตรวจจับใบหน้า: ${facesDetected}`}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  color="primary"
                  startContent={
                    <Icon icon="solar:camera-linear" className="text-lg" />
                  }
                  onClick={capture}
                >
                  Capture
                </Button>
                <Button
                  size="sm"
                  color="default"
                  startContent={<Icon icon="pajamas:redo" />}
                  onClick={() => setImg([])}
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Container>
        <Container className="flex justify-center gap-2">
          {img.length > 0 &&
            img.map((item, index) => (
              <Image
                key={index}
                src={item}
                alt="image capture"
                className="w-24 h-24"
              />
            ))}
        </Container>
      </div>
    </Fragment>
  );
};

Home.getLayout = (page: ReactElement) => {
  return (
    <Fragment>
      <RootLayout>
        <MainLayout>{page}</MainLayout>
      </RootLayout>
    </Fragment>
  );
};

export default Home;
