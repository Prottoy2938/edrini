import React, { useState } from "react";
import { Box, Image, Heading, Stack, chakra, Text } from "@chakra-ui/react";
import Props from "./track-page-assemble.model";
import { isMobile, isTablet } from "react-device-detect";
import { v4 as uuid } from "uuid";
import TrackInfo from "../track-info/track-info";
import RatingSection from "../rating-section/rating-section";
import RelatedTrackCarousel from "../related-track-carousel/related-track-carousel";

const TrackPageAssemble: React.FC<Props> = (props: Props) => {
  const { trackData, relatedTracksData } = props;
  const ratingInfoAvailable = Boolean(trackData.ratings);
  const [userRating, setUserRating] = useState(4);

  const [trackTotalVotes, setTrackTotalVotes] = useState(
    ratingInfoAvailable ? trackData.ratings.totalVotes : 0
  );
  const [trackRating, setTrackRating] = useState(
    ratingInfoAvailable ? trackData.ratings.totalRatings / trackTotalVotes : 0
  );

  const lgImg = trackData.spotifyData.album.images[0].url;
  const mdImg = trackData.spotifyData.album.images[1].url;
  const smImg = trackData.spotifyData.album.images[2].url;
  const name = trackData.spotifyData.name;
  const artistNames = trackData.spotifyData.artists;

  return (
    <>
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
          <Box display="table" m="100px auto">
            {" "}
            <Stack isInline>
              <Heading>
                {isFinite(trackRating) && typeof trackRating === "number"
                  ? trackRating
                  : 0}
              </Heading>{" "}
              <Heading size="xs" mt="20px !important" color="grey.300">
                / 10
              </Heading>
            </Stack>
            <Text textAlign="center" mt={2} fontWeight="200">
              {isFinite(trackTotalVotes) && typeof trackTotalVotes === "number"
                ? trackTotalVotes
                : 0}
            </Text>
          </Box>
          <Box mb={20}>
            <Heading
              borderBottom="6px double gray"
              pb={1}
              display="table"
              mb={3}
              size="sm"
              color="grey.100"
            >
              You
            </Heading>
            <RatingSection
              userRating={userRating}
              setUserRating={setUserRating}
              trackData={trackData}
            />
          </Box>
          <TrackInfo trackData={trackData} />
        </Box>
      </Box>
      <RelatedTrackCarousel relatedTracksData={relatedTracksData} />
    </>
  );
};

export default TrackPageAssemble;
