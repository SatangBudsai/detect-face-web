import { Fragment, ReactElement, useState } from "react";
import { useTheme } from "next-themes";
import RootLayout from "@/layouts/root-layout";
import MainLayout from "@/layouts/main-layout";
import { DateRange } from "react-day-picker";
import Alert from "@/components/alert";
import { Button, Input, cn } from "@nextui-org/react";
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

type Props = {};

const Home = (props: Props) => {
  const loaderGlobal = useLoaderGlobal();

  const { theme, setTheme } = useTheme();
  const [date, setDate] = useState<Date | undefined>();
  const [arrDate, setArrDate] = useState<Date[] | undefined>();
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>();

  const getApi = async () => {
    loaderGlobal.start();
    await apiBase.get({ urlBase: "https://randomuser.me", url: "/api" });
    loaderGlobal.stop();
  };

  const width = 300;
  const height = 300;

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

  // console.log("boundingBox", boundingBox);

  return (
    <Fragment>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-center gap-5 text-4xl font-bold uppercase">
          Detect Face Website
        </div>
        <Container className="flex flex-col items-center justify-center gap-10">
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
                {box.height >= 0.4 ? (
                  box.yCenter >= 0.28 &&
                  box.yCenter <= 0.5 &&
                  box.xCenter >= 0.25 &&
                  box.xCenter <= 0.4 ? (
                    <div className="mt-2 text-xs text-success text-nowrap">
                      กรุณาค้างไว้ 3 วินาที
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-warning text-nowrap">
                      กรุณาขยับให้อยู่ตรงกลาง
                    </div>
                  )
                ) : (
                  <div className="mt-2 text-xs text-danger text-nowrap">
                    อยู่ห่างเกินไป
                  </div>
                )}
              </div>
            ))}
            <Webcam
              ref={webcamRef}
              width={width}
              height={height}
              forceScreenshotSourceSize
              className="object-cover p-0 rounded-xl drop-shadow-xl"
            />
          </div>
          <div className="w-full max-w-[30rem]">
            <p>{`Loading: ${isLoading}`}</p>
            <p>{`พบเจอใบหน้า: ${detected}`}</p>
            <p className="text-2xl font-bold text-warning">{`จำนวนตรวจจับใบหน้า: ${facesDetected}`}</p>
            {boundingBox.map((item, index) => (
              <div key={index} className="w-full p-2 border-2 rounded-lg">
                <div>size : {item.height.toFixed(2)}</div>
                <div>xCenter : {item.xCenter.toFixed(2)}</div>
                <div>yCenter : {item.yCenter.toFixed(2)}</div>
              </div>
            ))}
          </div>
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
