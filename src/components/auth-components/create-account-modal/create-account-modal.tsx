import React from "react";
import { Box } from "@chakra-ui/react";

const CreateAccountModal: React.FC = () => {
  return (
    <Box>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
        <Box key={uuid()} width="3px" height={`${5 * num}px`} pr={1} pl={1} />
      ))}
    </Box>
  );
};

export default CreateAccountModal;
