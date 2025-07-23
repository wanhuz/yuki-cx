import { validateSeriesFilter } from "@/lib/util/animebytes";

describe("validateSeriesFilter", () => {
  const torrent = "Web | MKV | h264 | 1080p | AAC 2.0 | Softsubs (SubsPlease) | Episode 4 | Freeleech";

  it("should pass with matching ACCEPT filters", () => {
    const filters = [
      { id: 1, scheduler_id: 1, category: "QUALITY", mode: "ACCEPT", value: "1080p" },
      { id: 2, scheduler_id: 1, category: "EXTENSION", mode: "ACCEPT", value: "MKV" },
      { id: 3, scheduler_id: 1, category: "SUBGROUP", mode: "ACCEPT", value: "SubsPlease" },
    ];
    expect(validateSeriesFilter(filters, torrent)).toBe(true);
  });

  it("should fail if ACCEPT filter does not match", () => {
    const filters = [
      { id: 1, scheduler_id: 1, category: "QUALITY", mode: "ACCEPT", value: "720p" },
    ];
    expect(validateSeriesFilter(filters, torrent)).toBe(false);
  });

  it("should fail if REJECT filter matches", () => {
    const filters = [
      { id: 1, scheduler_id: 1, category: "EXTENSION", mode: "REJECT", value: "MKV" },
    ];
    expect(validateSeriesFilter(filters, torrent)).toBe(false);
  });

  it("should pass if REJECT filter does not match", () => {
    const filters = [
      { id: 1, scheduler_id: 1, category: "SUBGROUP", mode: "REJECT", value: "Erai-raws" },
    ];
    expect(validateSeriesFilter(filters, torrent)).toBe(true);
  });

  it("should pass if no filters", () => {
    expect(validateSeriesFilter([], torrent)).toBe(true);
  });

  it("should skip unknown filter categories", () => {
    const filters = [
      { id: 1, scheduler_id: 1, category: "UNKNOWN", mode: "ACCEPT", value: "???"},
    ];
    expect(validateSeriesFilter(filters, torrent)).toBe(true); // unknown = ignored
  });
});
