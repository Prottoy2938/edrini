import React, { useState } from "react";
import { Box, Image, Heading, Text, chakra, Stack } from "@chakra-ui/react";
import Props from "./track-page-assemble.model";
import { isMobile, isTablet } from "react-device-detect";
import { v4 as uuid } from "uuid";
import TrackInfo from "../track-info/track-info";
import RatingSection from "../rating-section/rating-section";

const TrackPageAssemble: React.FC<Props> = (props: Props) => {
  const [userRating, setUserRating] = useState(4);

  const { trackData } = props;
  console.log(trackData);
  const lgImg = trackData.spotifyData.album.images[0].url;
  const mdImg = trackData.spotifyData.album.images[1].url;
  const smImg = trackData.spotifyData.album.images[2].url;
  const name = trackData.spotifyData.name;
  const artistNames = trackData.spotifyData.artists;

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
        <RatingSection userRating={userRating} setUserRating={setUserRating} />
        <TrackInfo trackData={trackData} />
      </Box>
    </Box>
  );
};

export default TrackPageAssemble;
