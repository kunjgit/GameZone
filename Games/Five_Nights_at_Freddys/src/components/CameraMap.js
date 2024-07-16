import React from "react";
import Media from "./Media";

function CameraMap(props) {
    const { handleCameraChange } = props;
    return (
        <div className="map" style={{ position: "absolute", zIndex: 10 }}>
            <img
                alt="Mapa da câmera"
                draggable="false"
                src={Media.Images.Map}
                style={{ zIndex: "1", width: "100%" }}
                useMap="#map"
            />
            <a
                href=""
                onClick={handleCameraChange}
                title="Stage"
                style={{
                    position: "absolute",
                    left: "27.25%",
                    top: "5%",
                    width: "13.25%",
                    height: "9.25%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="Restrooms"
                style={{
                    position: "absolute",
                    left: "79.75%",
                    top: "24.25%",
                    width: "12.75%",
                    height: "8.25%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="Dinning Area"
                style={{
                    position: "absolute",
                    left: "24%",
                    top: "20.5%",
                    width: "12.25%",
                    height: "8.25%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="Backstage"
                style={{
                    position: "absolute",
                    left: "0%",
                    top: "27%",
                    width: "13.5%",
                    height: "9%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="Pirate Cove"
                style={{
                    position: "absolute",
                    left: "12%",
                    top: "39.5%",
                    width: "12.75%",
                    height: "9%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="Supply Closet"
                style={{
                    position: "absolute",
                    left: "8.25%",
                    top: "62.5%",
                    width: " 12%",
                    height: "8.25%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="West Hall"
                style={{
                    position: "absolute",
                    left: "26.5%",
                    top: " 70.5%",
                    width: "12.5%",
                    height: "9.25%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="East Hall"
                style={{
                    position: "absolute",
                    left: "49%",
                    top: "70%",
                    width: "14.5%",
                    height: "9.5%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="W. Hall Corner"
                style={{
                    position: "absolute",
                    left: "26%",
                    top: "81.75%",
                    width: "14%",
                    height: "8.25%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="E. Hall Corner"
                style={{
                    position: "absolute",
                    left: " 49.25%",
                    top: "81.25%",
                    width: "14.25%",
                    height: "10%",
                    zIndex: 2,
                }}
            ></a>
            <a
                href=""
                onClick={handleCameraChange}
                title="Kitchen"
                style={{
                    position: "absolute",
                    left: "79.5%",
                    top: "57.75%",
                    width: "14.25%",
                    height: "9.25%",
                    zIndex: 2,
                }}
            ></a>
        </div>
    );
}

export default CameraMap;
