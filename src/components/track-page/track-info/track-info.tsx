import React from "react";
import { Box, Image, Heading, Text, chakra, Stack } from "@chakra-ui/react";
import Props from "./track-info.model";
import { isMobile, isTablet } from "react-device-detect";
import { v4 as uuid } from "uuid";
import millisToMinutesAndSeconds from "../../../helper-functions/helper-function";

const TrackInfo: React.FC<Props> = (props: Props) => {
  const { trackData } = props;
  console.log(trackData);
  const lgImg = trackData.spotifyData.album.images[0].url;
  const mdImg = trackData.spotifyData.album.images[1].url;
  const smImg = trackData.spotifyData.album.images[2].url;
  const name = trackData.spotifyData.name;
  const albumName = trackData.spotifyData.album.name;
  const albumId = trackData.spotifyData.album.id;
  const artistNames = trackData.spotifyData.artists;
  const duration = millisToMinutesAndSeconds(trackData.spotifyData.duration_ms);
  const releasedDate = new Date(
    trackData.spotifyData.album.release_date._seconds * 1000
  ).toLocaleDateString();

  return (
    <Box
      w={["95%", "75%", "60%", "50%"]}
      m="0 auto"
      mt={5}
      justifyContent="center"
    >
      <Image
        w={["90%", "75%", "200px", "300px"]}
        src={isMobile ? smImg : isTablet ? mdImg : lgImg}
        alt={name}
        borderRadius="2%"
        m="0 auto"
      />
      <Box pl="200px" m="0 auto" mt={8}>
        <Heading>{name}</Heading>
        <Heading mt={2} as="h3" size="md">
          By{" "}
          {artistNames.map((artist, i) => (
            <chakra.a
              key={uuid()}
              _hover={{
                color: "#dbdbdb",
                textDecor: "underline",
              }}
              href={`/artist?i=${artist.id}`}
              title={`${artist.name}'s page`}
            >
              {" "}
              {artist.name}{" "}
              {artistNames.length > 1 || i + 1 !== artistNames.length
                ? ","
                : ""}{" "}
            </chakra.a>
          ))}
        </Heading>

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
      </Box>
    </Box>
  );
};

export default TrackInfo;
