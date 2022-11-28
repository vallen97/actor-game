import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Center,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useMemo, useState } from 'react';
import Cookie from 'js-cookie';

interface actorOutputGameProps {
  id: Array<{
    prev: { id: number; type: number };
    now: { id: number; type: number };
  }>;
}

const startImageURL: string = 'https://image.tmdb.org/t/p/w500';

export const ActorOutputGame: React.FC<actorOutputGameProps> = (props) => {
  const [result, setResult] = useState(() => {
    return [];
  });

  let API_KEY: string = process.env.API_KEY;
  let cookie = Cookie.get('moviedbapikey');

  if (cookie != null || typeof cookie != 'undefined') API_KEY = cookie;

  // let results: Array<{
  //   index: number; // just to show in the results
  //   title: string; // can be a movie title or persons name
  //   imageURL: string; // URL to display the person
  //   before: number; // name of the previous id
  //   current: number; // name of the current id
  //   about: string; // about the person or movie
  // }> = [];

  async function getResults(): Promise<any> {
    let results: Array<{
      index: number; // just to show in the results
      title: string; // can be a movie title or persons name
      imageURL: string; // URL to display the person
      before: number; // name of the previous id
      current: number; // name of the current id
      about: string; // about the person or movie
    }> = [];

    for (let i = 0; i < props.id.length; i++) {
      let tempReturnedObject: any = {};

      if (i == 0) {
        let getActorDetailsURL: string = `https://api.themoviedb.org/3/person/${props.id[i].prev.id}?api_key=${API_KEY}&language=en-US`;
        tempReturnedObject = await getActorDetails(getActorDetailsURL);
      } else if (i == props.id.length - 1) {
        if (
          props.id[i - 1].now.id == props.id[i].prev.id &&
          props.id[i - 1].now.type == props.id[i].prev.type
        ) {
          let getMovieDetailsURL: string = `https://api.themoviedb.org/3/movie/${props.id[i].prev.id}?api_key=${API_KEY}&language=en-US`;
          tempReturnedObject = await getMovieDetails(getMovieDetailsURL);
          results.push({
            index: i + 1,
            title: tempReturnedObject.name,
            imageURL: startImageURL + tempReturnedObject.image_Path,
            before: props.id[i].prev.id,
            current: props.id[i].now.id,
            about: tempReturnedObject.biography,
          });
        }
        let getActorDetailsURL: string = `https://api.themoviedb.org/3/person/${props.id[i].now.id}?api_key=${API_KEY}&language=en-US`;
        tempReturnedObject = await getActorDetails(getActorDetailsURL);
      } else if (i > 0 && i < props.id.length - 1) {
        if (props.id[i].now.type == 1) {
          let getMovieDetailsURL: string = `https://api.themoviedb.org/3/movie/${props.id[i].now.id}?api_key=${API_KEY}&language=en-US`;
          tempReturnedObject = await getMovieDetails(getMovieDetailsURL);
          if (
            tempReturnedObject == null ||
            typeof tempReturnedObject == 'undefined'
          ) {
            let getActorDetailsURL: string = `https://api.themoviedb.org/3/person/${props.id[i].now.id}?api_key=${API_KEY}&language=en-US`;
            tempReturnedObject = await getActorDetails(getActorDetailsURL);
          }
        } else if (props.id[i].now.type == 2) {
          let getActorDetailsURL: string = `https://api.themoviedb.org/3/person/${props.id[i].now.id}?api_key=${API_KEY}&language=en-US`;
          tempReturnedObject = await getActorDetails(getActorDetailsURL);
          if (
            tempReturnedObject == null ||
            typeof tempReturnedObject == 'undefined'
          ) {
            let getMovieDetailsURL: string = `https://api.themoviedb.org/3/movie/${props.id[i].now.id}?api_key=${API_KEY}&language=en-US`;
            tempReturnedObject = await getMovieDetails(getMovieDetailsURL);
          }
        }
      }

      if (
        tempReturnedObject != null ||
        typeof tempReturnedObject != 'undefined'
      ) {
        let hasBeen = false;
        results.forEach((element) => {
          if (element.before == props.id[i].now.id) hasBeen = true;
        });
        if (!hasBeen)
          results.push({
            index: i + 1,
            title: tempReturnedObject.name,
            imageURL: startImageURL + tempReturnedObject.image_Path,
            before: props.id[i].prev.id,
            current: props.id[i].now.id,
            about: tempReturnedObject.biography,
          });
      } else
        results.push({
          index: i + 1,
          title: 'Error',
          imageURL: 'https://via.placeholder.com/750',
          before: props.id[i].prev.id,
          current: props.id[i].now.id,
          about: 'There was an error',
        });
    }

    return results;
  }

  let tempRetObj: {};

  tempRetObj = useMemo(
    async () => await getResults().then((res) => setResult(res)),
    [tempRetObj]
  );
  function addDefaultSrc(ev: any) {
    ev.target.src = 'https://via.placeholder.com/750';
  }

  return (
    <SimpleGrid columns={3} spacing={1} pl={'2%'} pr={'2%'}>
      {result.map((item, i) => (
        <li key={i} style={{ listStyleType: 'none' }}>
          <Center py={6}>
            <Box
              maxW={'445px'}
              w={'full'}
              boxShadow={'2xl'}
              rounded={'md'}
              p={6}
              overflow={'hidden'}
            >
              <Box bg={'gray.500'} mt={-6} mx={-6} mb={6} pos={'relative'}>
                <>
                  <Image
                    boxSize='100%'
                    objectFit='cover'
                    src={item.imageURL}
                    fallbackSrc='https://via.placeholder.com/150'
                    alt='image from MovieDB'
                  />

                  <span
                    style={{
                      position: 'absolute',
                      fontSize: '20px',
                      backgroundColor: 'white',
                      width: '28px',
                      height: '28px',
                      color: 'black',
                      top: '0px',
                      right: '0px',
                      opacity: '0.6',
                    }}
                  >
                    <Center>{item.index}</Center>
                  </span>
                </>
              </Box>
              <Stack>
                <Text
                  color={'green.500'}
                  textTransform={'uppercase'}
                  fontWeight={800}
                  fontSize={'sm'}
                  letterSpacing={1.1}
                ></Text>
                <Heading fontSize={'2xl'} fontFamily={'body'}>
                  {item.title}
                </Heading>
                <Accordion allowToggle>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box flex='1' textAlign='left'>
                          About
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <Text color={'gray.500'}>{item.about}</Text>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Stack>
            </Box>
          </Center>
        </li>
      ))}
    </SimpleGrid>
  );
};

export default React.memo(ActorOutputGame);

async function getMovieDetails(movie_URL: string): Promise<any> {
  let returnedObject: {
    name: string;
    image_Path: string;
    biography: string;
  };

  try {
    await axios.get(movie_URL).then(function (response) {
      returnedObject.name = response.data.original_title;
      returnedObject.image_Path = response.data.poster_path;
      returnedObject.biography = response.data.overview;
    });
    return returnedObject;
  } catch (error) {
    console.error(error);
  }
}

async function getActorDetails(actor_URL: string): Promise<any> {
  let returnedObject: {
    name: string;
    image_Path: string;
    biography: string;
  };
  try {
    await axios.get(actor_URL).then(function (response) {
      returnedObject.name = response.data.name;
      returnedObject.image_Path = response.data.profile_path;
      returnedObject.biography = response.data.biography;
    });
    return returnedObject;
  } catch (error) {
    console.error(error);
  }
}
