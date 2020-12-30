interface VotingData {
  age: {
    [key: number]: number;
  };

  demographic: {
    [key: string]: number;
  };

  gender: {
    male: number;
    female: number;
    other: number;
  };

  totalVotes: number;
}

interface TrackDataProps {
  pageViews: {
    totalViews: number;
    viewTime: {
      [key: string]: {
        [key: string]: number;
      };
    };
  };

  ratings: {
    totalRatings: number;
    totalVotes: number;
    votes: {
      "1star"?: VotingData;
      "2star"?: VotingData;
      "3star"?: VotingData;
      "4star"?: VotingData;
      "5star"?: VotingData;
      "6star"?: VotingData;
      "7star"?: VotingData;
      "8star"?: VotingData;
      "9star"?: VotingData;
      "10star"?: VotingData;
    };
  };

  spotifyData: {
    album: {
      album_type: "string";
      artists: {
        external_urls: { spotify: string; href: string };
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: { height: string; width: string; url: string }[];
      name: string;
      release_date: any;
      release_date_precision: string;
      total_tracks: number;
      type: string;
      uri: string;
    };

    artists: {
      id: string;
      name: string;
      type: string;
      uri: string;
      external_urls: {
        spotify: string;
      };
    }[];
    available_markets: string[];

    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
    };

    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_local: boolean;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
  };
}

export default TrackDataProps;
