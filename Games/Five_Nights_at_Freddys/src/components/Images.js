///SHOW STAGE
import Stage from "../media/Textures/Cams/Stage.webp";
import Stage_b_c_f from "../media/Textures/Cams/Stage-b-c-f.webp";
import Stage_b_f from "../media/Textures/Cams/Stage-b-f.webp";
import Stage_c_f from "../media/Textures/Cams/Stage-c-f.webp";
import Stage_f from "../media/Textures/Cams/Stage-f.webp";

///DINNING AREA
import DinningArea from "../media/Textures/Cams/DinningArea.webp";
import DinningArea_b from "../media/Textures/Cams/DinningArea-b.webp";
import DinningArea_c from "../media/Textures/Cams/DinningArea-c.webp";
import DinningArea_f from "../media/Textures/Cams/DinningArea-f.webp";
import DinningArea_b_c from "../media/Textures/Cams/DinningArea-b-c.webp";
import DinningArea_c_f from "../media/Textures/Cams/DinningArea-c-f.webp";
import DinningArea_b_f from "../media/Textures/Cams/DinningArea-b-f.webp";
import DinningArea_b_c_f from "../media/Textures/Cams/DinningArea-b-c-f.webp";

///BACKSTAGE
import Backstage from "../media/Textures/Cams/Backstage.webp";
import Backstage_b from "../media/Textures/Cams/Backstage-b.webp";

///PIRATE COVE
import PirateCove from "../media/Textures/Cams/Pirate_Cove.webp";
import PirateCove_1 from "../media/Textures/Cams/Pirate_Cove-1.webp";
import PirateCove_2 from "../media/Textures/Cams/Pirate_Cove-2.webp";
import PirateCove_3 from "../media/Textures/Cams/Pirate_Cove-3.webp";

///SUPPLY ROOM
import SupplyCloset from "../media/Textures/Cams/SupplyRoom.webp";
import SupplyCloset_b from "../media/Textures/Cams/SupplyRoom-b.webp";

///WEST HALL
import WestHall from "../media/Textures/Cams/West_Hall.webp";
import WestHall_b from "../media/Textures/Cams/West_Hall-b.webp";
import FoxyHallway from "../media/Textures/Foxy-Hallway.webp";

///WEST HALL CORNER
import WHallCorner from "../media/Textures/Cams/WHallCorner.webp";
import WHallCorner_b from "../media/Textures/Cams/WHallCorner-b.webp";

///RESTROOMS
import Restrooms from "../media/Textures/Cams/Restrooms.webp";
import Restrooms_c from "../media/Textures/Cams/Restrooms-c.webp";
import Restrooms_f from "../media/Textures/Cams/Restrooms-f.webp";
import Restrooms_c_f from "../media/Textures/Cams/Restrooms-c-f.webp";

///EAST HALL
import EastHall from "../media/Textures/Cams/East_Hall.webp";
import EastHall_c from "../media/Textures/Cams/East_Hall-c.webp";
import EastHall_f from "../media/Textures/Cams/East_Hall-f.webp";
import EastHall_c_f from "../media/Textures/Cams/East_Hall-c-f.webp";

///EAST HALL CORNER
import EHallCorner from "../media/Textures/Cams/EHallCorner.webp";
import EHallCorner_c from "../media/Textures/Cams/EHallCorner-c.webp";
import EHallCorner_f from "../media/Textures/Cams/EHallCorner-f.webp";

import Kitchen from "../media/Textures/black.jpg";
import Kitchen_c from "../media/Textures/black.jpg";
import Kitchen_f from "../media/Textures/black.jpg";
import Kitchen_c_f from "../media/Textures/black.jpg";

const cameraImages = {
  Stage,
  Stage_b_c_f,
  Stage_b_f,
  Stage_c_f,
  Stage_f,
  DinningArea,
  DinningArea_b_c_f,
  DinningArea_c_f,
  DinningArea_b_f,
  DinningArea_b_c,
  DinningArea_b,
  DinningArea_c,
  DinningArea_f,
  Backstage,
  Backstage_b,
  SupplyCloset,
  SupplyCloset_b,
  WestHall,
  WestHall_b,
  WHallCorner,
  WHallCorner_b,
  Restrooms,
  Restrooms_c,
  Restrooms_c_f,
  Restrooms_f,
  EastHall,
  EastHall_c,
  EastHall_c_f,
  EastHall_f,
  EHallCorner,
  EHallCorner_c,
  EHallCorner_f,
  EHallCorner_c_f: EHallCorner_f,
  PirateCove,
  PirateCove_1,
  PirateCove_2,
  PirateCove_3,
  Kitchen,
  Kitchen_c,
  Kitchen_f,
  Kitchen_c_f,
};

export default function getCam(animatronics, camera, foxy = "") {
  let location = camera.trim().replaceAll(" ", "");

  if (location === "W.HallCorner") location = "WHallCorner";
  if (location === "E.HallCorner") location = "EHallCorner";

  return cameraImages[
    `${location}${animatronics}${location === "PirateCove" ? foxy : ""}`
  ];
}
