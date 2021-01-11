import { AlertTitleProps } from "@chakra-ui/react";

interface AlbumDataProps {
  spotifyData: {
    message: {
      album_type: string;
      artists: {
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: string;
        uri: string;
      }[];

      available_markets: string[];
      copyrights: { text: string; type: string }[];
      external_ids: {
        upc: string;
      };
      external_urls: {
        spotify: string;
      };
      genres: string[];

      href: string;
      id: string;
      images: { height: number; url: string; width: number }[];
      label: string;
      name: string;
      popularity: number;
      release_date: any;
      release_date_precision: string;
      total_tracks: number;
      tracks: {
        href: string;
        items: {
          artists: {
            external_urls: {
              spotify: string;
            };
            href: string;
            id: string;
            name: string;
            type: string;
            uri: string;
          };
          available_markets: string[];
          disc_number: number;
          duration_ms: number;
          explicit: boolean;
          external_urls: {
            spotify: string;
          };
          href: string;
          id: string;
          is_local: boolean;
          name: string;
          preview_url: string;
          track_number: number;
          type: string;
          uri: string;
        }[];

        limit: number;
        next: string;
        offset: number;
        previous: string;
        total: number;
      };
      type: string;
      uri: string;
    };
  };
}

export default AlbumDataProps;
