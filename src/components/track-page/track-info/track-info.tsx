import React from "react";
import { Box, Image } from "@chakra-ui/react";
import Props from "./track-info.model";
import { isMobile, isTablet } from "react-device-detect";

const TrackInfo: React.FC<Props> = (props: Props) => {
  const { trackData } = props;
  console.log(trackData);
  const lgImg = trackData.spotifyData.album.images[0].url;
  const mdImg = trackData.spotifyData.album.images[1].url;
  const smImg = trackData.spotifyData.album.images[2].url;
  const name = trackData.spotifyData.name;
  //   const lgImg =
  //     "https://template.canva.com/EADaoxINdvA/3/0/400w-hj8ip8mP9K0.jpg";
  //   const mdImg =
  //     "https://template.canva.com/EADaoxINdvA/3/0/400w-hj8ip8mP9K0.jpg";
  //   const smImg =
  //     "https://template.canva.com/EADaoxINdvA/3/0/400w-hj8ip8mP9K0.jpg";
  //   const name = "Hello World";

  return (
    <Box w={["50%", "60%", "75%", "95%"]} m="0 auto" mt={5}>
      <Image
        w={["90%", "75%", "200px", "300px"]}
        src={isMobile ? smImg : isTablet ? mdImg : lgImg}
        alt={name}
        borderRadius="5%"
      />
    </Box>
  );
};

export default TrackInfo;
