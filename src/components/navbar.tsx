import { CloseIcon, HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Link,
  Stack,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import React from 'react';
import ThemeButton from './theme-button';

const Links = ['ActorGame'];

interface navbarProps {
  navBarLinks?: Array<string>;
  navBarLinkName?: Array<string>;
}

export const Navbar: React.FC<navbarProps> = ({}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bg = useColorModeValue('gray.100', 'gray.900');
  return (
    <>
      <Box bg={bg} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box>
              <NextLink href='/'>Home</NextLink>
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {Links.map((link, index) => (
                <NextLink key={index} href={link}>
                  {link}
                </NextLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Link href='/setting'>
              <Button
                leftIcon={<SettingsIcon />}
                colorScheme='pink'
                variant='solid'
                m={3}
              >
                Settings
              </Button>
            </Link>

            {/* <SettingsIcon href='/setting' m={3}></SettingsIcon> */}

            <ThemeButton></ThemeButton>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link, index) => (
                <NextLink key={index} href={link}>
                  {link}
                </NextLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
};

export default Navbar;
