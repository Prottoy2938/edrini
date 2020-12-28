import React from "react";
import { NextSeo } from "next-seo";
import {
  Input,
  Box,
  Heading,
  InputGroup,
  InputRightElement,
  DarkMode,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const Home: React.FC = () => {
  return (
    <>
      <NextSeo
        title="Edrini"
        description="A Web Platform Where You Can Rate Music"
      />
      <Box bg="black" w="100vw" height="100vh">
        <Box d="table" m="0 auto" pt="100px">
          <Box>
            <Heading textAlign="center" size="3xl">
              Edrini
            </Heading>
            <Heading textAlign="center" as="h3" mt={10} fontSize="3xl">
              A Web Platform Where You Can Rate Music
            </Heading>
          </Box>
          <Box mt={16}>
            <DarkMode>
              <InputGroup size="lg" w="800px">
                <InputRightElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputRightElement>
                <Input autoFocus variant="filled" placeholder="search" />
              </InputGroup>
            </DarkMode>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
