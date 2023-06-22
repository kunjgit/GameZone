export type Extra = {
  i18nKey: string;
  points: number;
};

export const extras: { [name: string]: Extra } = {
  doppelkopf: { i18nKey: "doppelkopf", points: 1 },
  fox: { i18nKey: "fox", points: 1 },
  charlie_caught: { i18nKey: "charlie_caught", points: 1 },
  charlie: { i18nKey: "charlie", points: 1 },
  win: { i18nKey: "win", points: 1 },
  beat_re: { i18nKey: "beat_re", points: 1 },
  no_90: { i18nKey: "no_90", points: 1 },
  no_60: { i18nKey: "no_60", points: 1 },
  no_30: { i18nKey: "no_30", points: 1 },
  no_points: { i18nKey: "no_points", points: 1 },
  announced_re: { i18nKey: "announced_re", points: 2 },
  announced_kontra: { i18nKey: "announced_kontra", points: 2 },
  announced_no_90: { i18nKey: "announced_no_90", points: 1 },
  announced_no_60: { i18nKey: "announced_no_60", points: 1 },
  announced_no_30: { i18nKey: "announced_no_30", points: 1 },
  announced_no_points: { i18nKey: "announced_no_points", points: 1 },
  got_120_against_no_90: { i18nKey: "got_120_against_no_90", points: 1 },
  got_90_against_no_60: { i18nKey: "got_90_against_no_60", points: 1 },
  got_60_against_no_30: { i18nKey: "got_60_against_no_30", points: 1 },
  got_30_against_no_points: { i18nKey: "got_30_against_no_points", points: 1 },
  opposing_party_announced_no_90: {
    i18nKey: "opposing_party_announced_no_90",
    points: 1,
  },
  opposing_party_announced_no_60: {
    i18nKey: "opposing_party_announced_no_60",
    points: 1,
  },
  opposing_party_announced_no_30: {
    i18nKey: "opposing_party_announced_no_30",
    points: 1,
  },
  opposing_party_announced_no_points: {
    i18nKey: "opposing_party_announced_no_points",
    points: 1,
  },
};
