/// AUDIO
import CameraSound from "../media/Sounds/put down.mp3";
import CameraChange from "../media/Sounds/blip3.mp3";
import Ambience from "../media/Sounds/MainAmbience.mp3";
import FreddyLaugh1 from "../media/Sounds/FreddyLaugh1.mp3";
import FreddyLaugh2 from "../media/Sounds/FreddyLaugh2.mp3";
import Door from "../media/Sounds/Door.mp3";
import FoxyPunch from "../media/Sounds/knock2.mp3";
import Surprise from "../media/Sounds/windowscare.mp3";
import Jumpscare from "../media/Sounds/jumpscare.mp3";

/// IMAGES
import CameraButton from "../media/Textures/CameraButton.png";
import Up from "../media/Textures/Up.webp";
import Down from "../media/Textures/Down.webp";
import Map from "../media/Textures/Cams/Complete_Map.png";
import Stage from "../media/Textures/Cams/Stage-b-c-f.webp";

const Sounds = {
    OpenCamera: new Audio(CameraSound),
    CameraChange: new Audio(CameraChange),
    Ambience: new Audio(Ambience),
    FreddyLaugh1: new Audio(FreddyLaugh1),
    FreddyLaugh2: new Audio(FreddyLaugh2),
    Door: new Audio(Door),
    FoxyPunch: new Audio(FoxyPunch),
    Surprise: new Audio(Surprise),
    Jumpscare: new Audio(Jumpscare),
};

const Images = {
    CameraButton,
    Up,
    Down,
    Map,
    Stage,
    Ambience,
};

const Media = {
    Sounds,
    Images,
};

export default Media;
