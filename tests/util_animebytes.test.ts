import { extractCodecs, extractExtension, extractGroup, extractSource, extractResolution, extractSubtitle } from "@/lib/util/animebytes";

// {Release source} | {Extension} | {Aspect Ratio?} | {Video codec?} | {Resolution} | {Audio Codec} | {Subtitle type { Subgroup }} or RAW | {Episode no} | {Freeleech status}
const torrentProperties_episodic = "Web | MKV | h264 | 720p | AAC 2.0 | Softsubs (SubsPlease) | Episode 7 | Freeleech";
const torrentProperties_series = "Blu-ray | MKV | h264 10-bit | 720p | FLAC 2.0 | Softsubs (Doki)";
const torrentProperties_raw = "Blu-ray | M2TS (A) | 16:9 | h264 | 1080p | PCM 2.0 | RAW";
const torrentProperties_dvd5_iso = "DVD5 | ISO (R1) | 4:3 | 720x480 | AC3 2.0 | Dual Audio | Softsubs";
const torrentProperties_dvd = "DVD | MKV | h264 | 712x480 | Vorbis 2.0 | Softsubs (R-X)"
const torrentProperties_h265 = "  Blu-ray | MKV | h265 10-bit | 1080p | AC3 2.0 | Dual Audio | Softsubs (GHOST)";
const torrentProperties_X = "DVD | MKV | h264 | 640X352 | AAC 2.0 | Dual Audio | Softsubs (RaX)";

describe('testing extract extension', () => {
    it('extract extension should be MKV for ongoing series', () => {
      expect(extractExtension(torrentProperties_episodic)).toBe("MKV");
    });

    it('extract extension should be M2TS (A) for RAW', () => {
      expect(extractExtension(torrentProperties_raw)).toBe("M2TS (A)");
    });

    it('extract extension should be ISO (R1) for DVD5 ISO', () => {
      expect(extractExtension(torrentProperties_dvd5_iso)).toBe("ISO (R1)");
    });

});

describe('testing extract codecs', () => {
  it('extract codecs should be h264 AAC 2.0 for episodic', () => {
    expect(extractCodecs(torrentProperties_episodic)).toBe("h264 AAC 2.0");
  }); 

  it('extract codecs should be h264 PCM 2.0 for RAW', () => {
    expect(extractCodecs(torrentProperties_raw)).toBe("h264 PCM 2.0");
  }); 

  it('extract codecs should be AC3 2.0 for DVD5 ISO', () => {
    expect(extractCodecs(torrentProperties_dvd5_iso)).toBe("AC3 2.0");
  }); 

  it('extract codecs should be h265 10-bit  AC3 2.0', () => {
    expect(extractCodecs(torrentProperties_h265)).toBe("h265 10-bit AC3 2.0");
  }); 

  it('extract codecs should be h264 Vorbis 2.0 for DVD', () => {
    expect(extractCodecs(torrentProperties_dvd)).toBe("h264 Vorbis 2.0");
  }); 
});

describe('testing extract resolution', () => {
  it('extract resolution should be 720p for ongoing series', () => {
    expect(extractResolution(torrentProperties_episodic)).toBe("720p");
  }); 

  it('extract resolution should be 1080p for RAW', () => {
    expect(extractResolution(torrentProperties_raw)).toBe("1080p");
  }); 

  it('extract resolution should be 712x480 for no standard resolution', () => {
    expect(extractResolution(torrentProperties_dvd)).toBe("712x480");
  }); 

  it('extract resolution should be 640x352 for uppercase X', () => {
    expect(extractResolution(torrentProperties_X)).toBe("640x352");
  }); 
});

describe('testing extract subtitle', () => {
  it('extract subtitle should be Softsubs for ongoing series', () => {
    expect(extractSubtitle(torrentProperties_episodic)).toBe("Softsubs");
  }); 

  it('extract subtitle should be RAW for RAW', () => {
    expect(extractSubtitle(torrentProperties_raw)).toBe("RAW");
  }); 
});

describe('testing extract release type', () => {
  it('extract release type should be Web for episodic', () => {
    expect(extractSource(torrentProperties_episodic)).toBe("Web");
  }); 

  it('extract release type should be Blu-ray for finished series', () => {
    expect(extractSource(torrentProperties_series)).toBe("Blu-ray");
  }); 
});

describe('testing extract group', () => {
  it('extract group should be SubsPlease for episodic', () => {
    expect(extractGroup(torrentProperties_episodic)).toBe("SubsPlease");
  }); 

  it('extract group should be Doki for finished series', () => {
    expect(extractGroup(torrentProperties_series)).toBe("Doki");
  }); 

  it('extract group should be Blank for RAW', () => {
    expect(extractGroup(torrentProperties_raw)).toBe("　");
  }); 
});