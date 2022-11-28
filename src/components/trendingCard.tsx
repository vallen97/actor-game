import { genreMovieIDs } from '@/utils/actors/genreMovieIDs';
import { genreTVIDs } from '@/utils/actors/genreTVIDs';
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
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';

const movieIDs: any = genreMovieIDs;
const tvIds: any = genreTVIDs;

interface trendingCardProps {
  backdropImageURL?: string;
  backdropImageAlt?: string;
  movieTitle?: string;
  movieOriginalTitle?: string;
  movieOverview?: string;
  posterImageURL: string;
  posterImageAlt?: string;
  movieReleaseDate: string;
  movieRating: number;
  movieGenre?: Array<number>;
  movieName?: string;
  movieOriginalName?: string;
  movieMediaType?: string;
}

export const TrendingCard: React.FC<trendingCardProps> = (props) => {
  let moiveTitle: string = movieTitle(
    props.movieName,
    props.movieTitle,
    props.movieOriginalTitle,
    props.movieOriginalName
  );
  let genres: Array<string> = genreType(props.movieGenre, props.movieMediaType);
  return (
    <Center py={12}>
      <Box
        role={'group'}
        p={6}
        maxW={'330px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.800')}
        boxShadow={'2xl'}
        rounded={'lg'}
        pos={'relative'}
        zIndex={1}
      >
        <Box
          rounded={'lg'}
          mt={-12}
          pos={'relative'}
          height={'230px'}
          _after={{
            transition: 'all .3s ease',
            content: '""',
            w: 'full',
            h: 'full',
            pos: 'absolute',
            top: 5,
            left: 0,
            backgroundImage: `url(${props.backdropImageURL})`,
            filter: 'blur(15px)',
            zIndex: -1,
          }}
          _groupHover={{
            _after: {
              filter: 'blur(20px)',
            },
          }}
        >
          <Image
            rounded={'lg'}
            height={230}
            width={282}
            objectFit={'cover'}
            src={props.posterImageURL}
            alt='poster of the movie'
          />
        </Box>
        <Stack pt={10} align={'center'}>
          <Heading fontSize={'2xl'} fontFamily={'body'} fontWeight={500}>
            {moiveTitle}
          </Heading>
          <Accordion allowMultiple>
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    Overview:
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{props.movieOverview}</AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box flex='1' textAlign='left'>
                    Genre:
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>{genres.flat().toString()}</AccordionPanel>
            </AccordionItem>
          </Accordion>
          <Text
            color={'gray.500'}
            fontSize={'sm'}
            textTransform={'uppercase'}
          ></Text>
          <Stack direction={'row'} align={'center'}>
            <Text fontWeight={800} fontSize={'xl'}>
              Rating: {props.movieRating} /10
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
};

export default TrendingCard;

function genreType(move_genres: Array<number>, type: string): string[] {
  let genres: Array<string> = [];
  if (type == 'movie') {
    for (let i = 0; i < move_genres.length; i++) {
      for (let j = 0; j < movieIDs.length; j++) {
        if (move_genres[i] == movieIDs[j].id) {
          genres.push(movieIDs[j].genre);
        }
      }
    }
  } else if ((type = 'tv')) {
    for (let i = 0; i < move_genres.length; i++) {
      for (let j = 0; j < tvIds.length; j++) {
        if (move_genres[i] == tvIds[j].id) {
          genres.push(tvIds[j].genre);
        }
      }
    }
  }
  return genres;
}

function movieTitle(
  movie_name: string,
  movie_title: string,
  movie_original_title: string,
  movie_original_name: string
): string {
  let moive_title: string = '';
  if (typeof movie_title != 'undefined') {
    moive_title = movie_title;
  } else if (typeof movie_name != 'undefined') {
    moive_title = movie_name;
  } else if (typeof movie_original_title != 'undefined') {
    moive_title = movie_original_title;
  } else if (typeof movie_original_name != 'undefined') {
    moive_title = movie_original_name;
  }

  return moive_title;
}
