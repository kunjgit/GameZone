import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import getCam from "./Images";

import AnimatronicsMoving from "../media/Sounds/garble1.mp3";
import AnimatronicsMoving2 from "../media/Sounds/garble2.mp3";
import Static from "../media/Textures/Static-Cam.webp";
import Black from "../media/Textures/black.jpg";
import Media from "./Media";

import CameraMap from "../components/CameraMap";
import CameraButton from "../components/CameraButton";

function Camera({
    animatronics,
    areAnimatronicsMoving,
    isCameraOpen,
    office,
    camera,
    cameraButtonDisappear,
    dispatch,
}) {
    const [Image, setImage] = useState(Media.Images.Stage);

    const closeCameraRef = useRef(null);
    const cameraDivRef = useRef(null);

    const handleCameraButton = () => {
        dispatch({ type: "SET_IS_OPEN" });
    };

    const handleCameraChange = (e) => {
        e.preventDefault();
        Media.Sounds.CameraChange.play();
        dispatch({ type: "CHANGE_CAMERA", content: e.target.title });
    };

    useEffect(() => {
        if (cameraDivRef.current) {
            if (isCameraOpen)
                setTimeout(() => {
                    cameraDivRef.current.style.display = "flex";
                }, 350);
            else
                setTimeout(() => {
                    cameraDivRef.current.style.display = "none";
                }, 100);
        }
    }, [isCameraOpen]);

    useEffect(() => {
        const { Bonnie, Chica, Freddy, Foxy } = animatronics;
        let result = "";
        if (Bonnie.camera === camera) result += "_b";
        if (Chica.camera === camera) result += "_c";
        if (Freddy.camera === camera) result += "_f";

        const newCamera = getCam(result, camera, Foxy.camera);
        setImage(newCamera);
    }, [camera, animatronics, areAnimatronicsMoving, animatronics.Foxy.camera]);

    useEffect(() => {
        if (areAnimatronicsMoving && isCameraOpen) {
            let MusicNumber = Math.floor(Math.random() * 2);
            let Sound;
            if (MusicNumber == 1 || MusicNumber == 2) {
                Sound = new Audio(AnimatronicsMoving);
            } else {
                Sound = new Audio(AnimatronicsMoving2);
            }
            Sound.play();
        }
    }, [areAnimatronicsMoving]);

    return (
        <div>
            {cameraButtonDisappear ? null : (
                <CameraButton
                    handleCameraButton={handleCameraButton}
                    style={{ zIndex: "1" }}
                />
            )}
            {isCameraOpen ? (
                <>
                    <img
                        draggable="false"
                        className="camera opening animation"
                        data-left-door={office.leftDoor}
                        data-right-door={office.rightDoor}
                        id="camera"
                        src={Media.Images.Up}
                        alt="Opening camera"
                        style={{
                            margin: 0,
                            width: "100vw",
                            height: "100vh",
                            position: "absolute",
                            top: 0,
                        }}
                    />
                    <div
                        className="camera-container"
                        style={{ display: "none" }}
                        ref={cameraDivRef}
                    >
                        <CameraMap handleCameraChange={handleCameraChange} />
                        {areAnimatronicsMoving ? (
                            <img
                                draggable="false"
                                src={Black}
                                alt="Animatronics are moving"
                                className="animatronics-true"
                                style={{
                                    height: "100vh",
                                    width: "100vw",
                                    backgroundColor: "black",
                                    position: "absolute",
                                }}
                            />
                        ) : (
                            <img
                                src={Image}
                                alt="Camera"
                                className="camera-img"
                                style={{
                                    width: "100vw",
                                    position: "absolute",
                                }}
                            />
                        )}
                        <img
                            alt="Static"
                            src={Static}
                            style={{
                                opacity: "0.1",
                                width: "100vw",
                                height: "100vh",
                            }}
                            draggable="false"
                            className="static-open"
                        />
                    </div>
                </>
            ) : (
                <img
                    draggable="false"
                    className={`camera opening`}
                    id="camera"
                    ref={closeCameraRef}
                    src={Media.Images.Down}
                    alt="Closing camera"
                    style={{
                        width: "100vw",
                        height: "100vh",
                        position: "absolute",
                    }}
                />
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        animatronics: state.animatronicsReducer,
        camera: state.cameraReducer.camera,
        office: state.officeReducer,
        isCameraOpen: state.cameraReducer.isCameraOpen,
        areAnimatronicsMoving: state.cameraReducer.areAnimatronicsMoving,
        jumpscare: state.configReducer.jumpscare,
        cameraButtonDisappear: state.configReducer.cameraButtonDisappear,
    };
};

export default connect(mapStateToProps)(Camera);
