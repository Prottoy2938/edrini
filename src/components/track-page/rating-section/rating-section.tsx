import React from "react";
import { Box, Text } from "@chakra-ui/react";
import Slider, { Range } from "rc-slider";
import "rc-slider/assets/index.css";

const marks = {
  0: "0",
  10: "1",
  20: {
    style: {
      color: "#559945",
    },
    label: <strong>2</strong>,
  },
  30: "3",
  40: "4",
  50: {
    style: {
      color: "#00ccff",
    },
    label: <strong>5</strong>,
  },
  60: "6",
  70: "7",
  80: {
    style: {
      color: "#ffa200",
    },
    label: <strong>8</strong>,
  },
  90: "9",
  100: {
    style: {
      color: "#ff006f",
    },
    label: <strong>10</strong>,
  },
};

const RatingSection: React.FC = () => {
  return (
    <Box mt={6}>
      <Slider
        dots
        min={0}
        marks={marks}
        step={20}
        // onChange={log}
        defaultValue={20}
      />
      <Box>
        {/* <Text
          fontSize="lg"
          bg="#0085f2"
          pr={1}
          pl={1}
          display="table"
          float="right"
          mt={2}
        >
          7.6
        </Text> */}
      </Box>
    </Box>
  );
};

export default RatingSection;
