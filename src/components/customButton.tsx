import { Box, Button, Center, Text } from '@chakra-ui/react';
import React from 'react';

interface sortButtonProps {
  buttonID: string;
  buttonText: string;
  hide?: string;
  hideID?: string;
}

export const CustomButton: React.FC<sortButtonProps> = (prop) => {
  let hide = 'none';
  let hideID = 'overwrite';

  if (prop.hide) hide = prop.hide;
  if (prop.hideID) hideID = prop.hideID;
  return (
    <Center id={hideID} display={hide}>
      <Box m={4} width={{ base: '100%', xs: '95%', sm: '95%', md: '95%' }}>
        <Center>
          <Button id={prop.buttonID} type='button' width='auto%'>
            <Text fontSize={['xs', 'sm', 'md', 'lg', 'xl']}>
              {prop.buttonText}
            </Text>
          </Button>
        </Center>
      </Box>
    </Center>
  );
};

export default CustomButton;
