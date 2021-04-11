import React from "react";
import Carousel from "react-multi-carousel";
import { v4 as uuid } from "uuid";
import Props from "./related-tracks-carousel.model";
import CarouselCard from "../carousel-card/carousel-card";
import { Box } from "@chakra-ui/react";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1250 },
    items: 3,
    partialVisibilityGutter: 10,
  },
  desktop1: {
    breakpoint: { max: 1250, min: 998 },
    items: 3,
    partialVisibilityGutter: 0,
  },
  tablet: {
    breakpoint: { max: 998, min: 767 },
    items: 2,
    partialVisibilityGutter: 20,
  },
  mobile: {
    breakpoint: { max: 767, min: 525 },
    items: 1,
    partialVisibilityGutter: 15,
  },
  mobile1: {
    breakpoint: { max: 525, min: 0 },
    items: 1,
    partialVisibilityGutter: 0,
  },
};

//check if no data returned
const RelatedTrackCarousel: React.FC<Props> = (props: Props) => {
  const { relatedTracksData } = props;

  return (
    <Box w="90%" m="100px auto">
      <Carousel partialVisible responsive={responsive} draggable={false}>
        {relatedTracksData.map((trackData) => {
          return <CarouselCard key={uuid()} trackData={trackData} />;
        })}
      </Carousel>
    </Box>
  );
};

export default RelatedTrackCarousel;
