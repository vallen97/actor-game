import { Center, Stack, Text } from '@chakra-ui/react';
import React from 'react';

interface footerProps {}

export const Footer: React.FC<footerProps> = ({}) => {
  return (
    <Center
      bg='teal.500'
      color='white'
      bottom='0'
      width='100%'
      height='100px'
      zIndex={150}
      position='fixed'
    >
      <Stack spacing={3}>
        <Text fontSize='xl'>Contact: vaughnallen97@gmail.com</Text>
      </Stack>
    </Center>
  );
};

export default Footer;
