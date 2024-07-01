export enum Announcement {
  Re = "re", // note: the enum values are used as i18n keys so don't change them without changing i18n keys, too
  Kontra = "kontra",
  No90 = "no_90",
  No60 = "no_60",
  No30 = "no_30",
  NoPoints = "no_points",
}

export const announcementOrder = [
  Announcement.Re,
  Announcement.Kontra,
  Announcement.No90,
  Announcement.No60,
  Announcement.No30,
  Announcement.NoPoints,
];

export function getAnnouncementOrder(isRe: boolean): Announcement[] {
  const filterOut = isRe ? Announcement.Kontra : Announcement.Re;
  return announcementOrder.filter((a) => a !== filterOut);
}
