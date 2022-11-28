import { ActorCard } from '@/components/actorCard';
import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import theme from '@/theme';
import { MovieDBActor } from '@/types/moviedbActorTypes';
import PopularActors50 from '@/utils/actors/PopularActors50';
import { Box, Button, Input, Stack } from '@chakra-ui/react';
import { ThemeProvider } from '@emotion/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Cookie from 'js-cookie';

interface actorGameProps {}

type getActorResponse = {
  data: MovieDBActor[];
};

let displayActors: Array<any> = [];

export const ActorGame: React.FC<actorGameProps> = ({}) => {
  const [showActor, setshowActor] = useState([]);
  const [actorName, setActorName] = useState('');
  const [secondActorName, setSecondActorName] = useState('');

  let API_KEY: string = process.env.API_KEY;
  let cookie = Cookie.get('moviedbapikey');

  if (cookie != null || typeof cookie != 'undefined') API_KEY = cookie;

  useEffect(() => {}, []);

  const actorOnChangeHandler = (event) => {
    setActorName(event.target.value);
  };

  const secondActorOnChangeHandler = (event) => {
    setSecondActorName(event.target.value);
  };

  async function getTrending(inputName: string, secondInputName: string) {
    let tempFirstName: string;
    let tempSecondName: string;
    // if a user did not enter a name in the input field
    if (inputName == '' || typeof inputName == 'undefined') {
      // get a random name of most popular actor or actress
      tempFirstName =
        PopularActors50[Math.floor(Math.random() * PopularActors50.length)];
      setActorName(tempFirstName);
      inputName = tempFirstName;
    }
    if (secondInputName == '' || typeof secondInputName == 'undefined') {
      tempSecondName =
        PopularActors50[Math.floor(Math.random() * PopularActors50.length)];
      setSecondActorName(tempSecondName);
      secondInputName = tempSecondName;
    }

    // get the people that the user searched for
    try {
      setshowActor(null);
      displayActors = [];
      // 👇️ const data: GetUsersResponse
      await axios
        .get<getActorResponse[]>(
          `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${inputName}&page=1&include_adult=false`
        )
        .then(async (response: any) => {
          await axios
            .get<getActorResponse[]>(
              `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${secondInputName}&page=1&include_adult=false`
            )
            .then((SecondResponse: any) => {
              if (response != null || typeof response != 'undefined')
                if (
                  SecondResponse != null ||
                  typeof SecondResponse != 'undefined'
                )
                  displayActors.push([
                    <ActorCard
                      key={100}
                      responseData={response.data.results}
                      secondResponseData={SecondResponse.data.results}
                    />,
                  ]);

              setshowActor(displayActors);
            });
        });
    } catch (error) {
      displayActors = error;
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box position='relative' minHeight='100vh'>
        <Navbar />
        <Stack
          width={'100%'}
          direction={'row'}
          padding={4}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Input
            size='sm'
            value={actorName}
            onChange={actorOnChangeHandler}
            placeholder='Enter First Actor or actress name'
            _placeholder={{ opacity: 1, color: 'gray.500' }}
          />
          <Input
            size='sm'
            value={secondActorName}
            onChange={secondActorOnChangeHandler}
            placeholder='Enter Second Actor or actress name'
            _placeholder={{ opacity: 1, color: 'gray.500' }}
          />
          <Button
            onClick={() => getTrending(actorName, secondActorName)}
            colorScheme='teal'
            size='md'
          >
            Search
          </Button>
        </Stack>

        {showActor}

        <br />
        <br />
        <br />
        <br />

        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default ActorGame;
