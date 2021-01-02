import React from "react";
import { Box, Image, Button, Heading, Text } from "@chakra-ui/react";
import Props from "./carousel-card.model";
import { v4 as uuid } from "uuid";

const CarouselCard: React.FC<Props> = (props: Props) => {
  const { trackData } = props;
  const artistNames = trackData.spotifyData.artists;
  return (
    <Box>
      <Image src={trackData.spotifyData.album.images[0].url} />
      <Heading size="sm">{trackData.spotifyData.name}</Heading>
      <Text>
        {artistNames.map((artist, i) => (
          <span key={uuid}>
            {" "}
            {artist.name}{" "}
            {artistNames.length > 1 || i + 1 !== artistNames.length ? "," : ""}{" "}
          </span>
        ))}
      </Text>
      <Button colorScheme="teal">Visit</Button>
    </Box>
  );
};

export default CarouselCard;
