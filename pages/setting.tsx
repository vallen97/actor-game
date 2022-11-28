import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import {
  theme,
  Box,
  Text,
  Input,
  Center,
  VStack,
  StackDivider,
  Button,
} from '@chakra-ui/react';
import { ThemeProvider } from '@emotion/react';
import React, { useEffect } from 'react';
import Link from 'next/link';
import Cookie from 'js-cookie';

interface settingProps {}

export const Setting: React.FC<settingProps> = ({}) => {
  const [value, setValue] = React.useState('');
  // Regular Expression to check if there is a string that contains letter and numbers, that have 32 characters
  let regex = new RegExp('^[a-zA-Z0-9_.-]{32}$');
  let isAPIkey: boolean;

  const handleChange = (event) => {
    setValue(event.target.value);
    if (regex.test(event.target.value)) isAPIkey = true;
    else isAPIkey = false;
  };

  const btnOnClick = async () => {
    Cookie.set('moviedbapikey', value, { secure: true });
  };

  useEffect(() => {
    let inputAPI: any = document.getElementById('apiInput');
    let cookie = Cookie.get('moviedbapikey');
    if (cookie != null || typeof cookie != 'undefined') {
      inputAPI.value = cookie;
      setValue(cookie);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box position='relative' minHeight='100vh'>
        <Navbar />
        <Center>
          <VStack
            divider={<StackDivider borderColor='gray.200' />}
            spacing={4}
            align='stretch'
            marginTop={5}
          >
            <Link href='https://www.themoviedb.org/signup'>Sign-Up</Link>
            <Link href='https://www.themoviedb.org/settings/api'>
              Get API Key
            </Link>
            <Text mb='8px'>Enter MovieDB API Key: {value}</Text>
            <Input
              value={value}
              onChange={handleChange}
              placeholder='Enter Your API key'
              size='sm'
              id='apiInput'
            />
            <Button onClick={btnOnClick} colorScheme='teal' size='md'>
              Add API Key
            </Button>
          </VStack>
        </Center>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Setting;
