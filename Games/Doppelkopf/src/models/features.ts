import { Config } from "@/models/config";

export const Features: Features = {
  enableTutorial: Config.debug,
  enableAnnouncements: true,
  enableReservations: Config.debug,
};

interface Features {
  enableTutorial: boolean;
  enableAnnouncements: boolean;
  enableReservations: boolean;
}
