import React from "react";
import Media from "./Media";

function CameraButton(props) {
    const { handleCameraButton } = props;

    const handleCamera = ({ target }) => {
        if (target.dataset.disabled == "true") {
            target.dataset.disabled = "false";
            Media.Sounds.OpenCamera.play();
            handleCameraButton();
            setTimeout(() => {
                target.dataset.disabled = "true";
            }, 700);
        }
    };
    return (
        <div>
            <img
                draggable="false"
                className="camera-button"
                alt="Botão da camera"
                data-disabled="true"
                src={Media.Images.CameraButton}
                style={{ position: "absolute", zIndex: 1 }}
                onMouseOver={handleCamera}
                onTouchStart={handleCamera}
            />
        </div>
    );
}

export default CameraButton;
