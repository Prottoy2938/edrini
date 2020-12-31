import React from "react";
import { Box, Text, chakra, Stack } from "@chakra-ui/react";
import Props from "./track-info.model";
import millisToMinutesAndSeconds from "../../../helper-functions/helper-function";

const TrackInfo: React.FC<Props> = (props: Props) => {
  const { trackData } = props;

  const albumName = trackData.spotifyData.album.name;
  const albumId = trackData.spotifyData.album.id;
  const duration = millisToMinutesAndSeconds(trackData.spotifyData.duration_ms);
  const releasedDate = new Date(
    trackData.spotifyData.album.release_date._seconds * 1000
  ).toLocaleDateString();

  return (
    <Box mt={10}>
      <Stack spacing={4}>
        <Stack isInline spacing={5}>
          <Text>Album: </Text>
          <chakra.a
            _hover={{
              color: "#dbdbdb",
              textDecor: "underline",
            }}
            href={`/album?i=${albumId}`}
          >
            {albumName}
          </chakra.a>
        </Stack>
        <Stack isInline spacing={5}>
          <Text>Released: </Text>
          <Text>{releasedDate}</Text>
        </Stack>
        <Stack isInline spacing={5}>
          <Text>Duration: </Text>

          <Text>{duration}</Text>
        </Stack>
      </Stack>
    </Box>
  );
};

export default TrackInfo;
