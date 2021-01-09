import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import Props from "./carousel-card.model";
import { v4 as uuid } from "uuid";

const CarouselCard: React.FC<Props> = (props: Props) => {
  const { trackData } = props;
  const artistNames = trackData.spotifyData.artists;

  return (
    <a href={`/track?s=${trackData.spotifyData.id}`}>
      <Box
        w="300px"
        height="300px"
        backgroundImage={`url(${trackData.spotifyData.album.images[0].url})`}
        opacity="0.65"
        _hover={{ opacity: "0.99" }}
        cursor="pointer"
        borderRadius={5}
        pl={7}
        pr={4}
        pt="70px"
      >
        <Box>
          <Heading>{trackData.spotifyData.name}</Heading>
          <Text mt={3}>
            {artistNames.map((artist, i) => (
              <span key={uuid}>
                {" "}
                {artist.name}{" "}
                {artistNames.length > 1 || i + 1 !== artistNames.length
                  ? ","
                  : ""}{" "}
              </span>
            ))}
          </Text>
        </Box>
      </Box>
    </a>
  );
};

export default CarouselCard;
