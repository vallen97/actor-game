import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import theme from '@/theme';
import { Box, SimpleGrid } from '@chakra-ui/react';
import { ThemeProvider } from '@emotion/react';
import React, { useEffect, useState } from 'react';
import TrendingCard from '@/components/trendingCard';
import { MovieDBTrending } from '@/types/movieDBTrendindTypes';
import axios from 'axios';
import Cookie from 'js-cookie';

interface homeProps {}

type getTrendingResponse = {
  data: MovieDBTrending[];
};

let trendingResults: any = null;
let displayTrending: Array<any> = [];

const startImageURL: string = 'https://image.tmdb.org/t/p/w500';

export const Home: React.FC<homeProps> = ({}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTrending, setShowTreding] = useState([]);

  useEffect(() => {
    async function getTrending() {
      let API_KEY: string = process.env.API_KEY;
      let cookie = Cookie.get('moviedbapikey');

      if (cookie != null || typeof cookie != 'undefined') API_KEY = cookie;
      try {
        await axios
          .get<getTrendingResponse[]>(
            'https://api.themoviedb.org/3/trending/all/day?api_key=' + API_KEY
          )
          .then((response: any) => {
            response.data.results.forEach((element) => {
              displayTrending.push([
                <TrendingCard
                  key={element.id}
                  backdropImageURL={startImageURL + element.backdrop_path}
                  backdropImageAlt='None'
                  movieTitle={element.title}
                  movieOriginalTitle={element.original_title}
                  movieOverview={element.overview}
                  posterImageURL={startImageURL + element.poster_path}
                  posterImageAlt='none'
                  movieReleaseDate={element.release_date}
                  movieRating={element.vote_average}
                  movieGenre={element.genre_ids}
                  movieName={element.name}
                  movieOriginalName={element.original_name}
                  movieMediaType={element.media_type}
                />,
              ]);
            });

            setShowTreding(displayTrending);
            setIsLoaded(true);
          });
      } catch (error) {
        setIsLoaded(false);
        trendingResults = error;
      }
    }

    getTrending();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box position='relative' minHeight='100vh'>
        <Navbar />
        <SimpleGrid columns={[1, 1, 1, 2, 3, 4]} pb='100px'>
          {showTrending}
        </SimpleGrid>
        <br />
        <br />
        <br />
        <br />
        <br />
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Home;
