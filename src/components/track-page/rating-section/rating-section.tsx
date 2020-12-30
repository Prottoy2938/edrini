import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const RatingSection = () => {
  return (
    <Box mt={6}>
      <Range />
      <Box>
        <Text
          fontSize="lg"
          bg="#0085f2"
          pr={1}
          pl={1}
          display="table"
          float="right"
          mt={2}
        >
          7.6
        </Text>
      </Box>
    </Box>
  );
};

export default RatingSection;
