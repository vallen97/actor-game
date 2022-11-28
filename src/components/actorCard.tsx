import {
  Box,
  Button,
  Center,
  Checkbox,
  Flex,
  Grid,
  GridItem,
  Heading,
  Image,
  ListItem,
  OrderedList,
  Stack,
  StackDivider,
  Text,
  UnorderedList,
  VStack,
} from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react';
import ActorOutputGame from './ActorOutputGame';
import Cookie from 'js-cookie';

let API_KEY: string = process.env.API_KEY;

interface actorCardProps {
  responseData: any;
  secondResponseData: any;
}

let selectedID: Array<number> = [];

export const ActorCard: React.FC<actorCardProps> = (props) => {
  const [hasAPIKey, setHasAPIKey] = useState(false);
  const [results, setResults] = useState([]);

  const [isShownResults, sethownResults] = useState(true);
  const [isShowCompare, setIsShowCompare] = useState(false);

  const [actor1GridStart, setActor1GridStart] = useState(4);
  const [actor1GridEnd, setActor1GridEnd] = useState(5);
  const [actor2GridStart, setActor2GridStart] = useState(5);
  const [actor2GridEnd, setActor2GridEnd] = useState(6);

  const [resultsGridStart, setResultsGridStart] = useState(2);
  const [resultsGridEnd, setResultsGridEnd] = useState(6);
  const [compareGridStart, setCompareGridStart] = useState(1);
  const [compareGridEnd, setCompareGridEnd] = useState(4);

  let button1: HTMLButtonElement = null;

  let cookie = Cookie.get('moviedbapikey');

  if (cookie != null || typeof cookie != 'undefined') {
    API_KEY = cookie;
    setHasAPIKey(true);
  }

  async function game() {
    sethownResults(true);

    return await startObject(selectedID[0], selectedID[1]);
  }

  // get the person selected and remove then if unselected
  function checkboxOnChange(event: any) {
    if (event.nativeEvent.target.checked) {
      if (selectedID.length < 2) {
        selectedID.push(Number(event.nativeEvent.target.defaultValue));
      }
    } else if (!event.nativeEvent.target.checked) {
      const index = selectedID.indexOf(
        Number(event.nativeEvent.target.defaultValue)
      );
      if (index > -1) {
        selectedID.splice(index, 1);
      }
    }
  }

  // first function of the comparision
  async function startObject(id1: number, id2: number) {
    // start the object
    // want the IDs of the actors to compare
    var data: any = {
      mainActor1ID: id1,
      mainActor2ID: id2,
    };

    // check if the movies of the Main Actors are the same
    return Promise.allSettled([
      Promise.resolve(getActorCredits(id1)),
      Promise.resolve(getActorCredits(id2)),
    ]).then((res: any) => {
      let tempArray = checkMainActorIDs(id1, res[0].value, id2, res[1].value);

      // if the Ids are not the same
      if (!tempArray[0]) {
        data[`Movie1IDs`] = tempArray[1];
        data[`Movie2IDs`] = tempArray[2];

        //  make an object of the IDs
        return Promise.allSettled([
          popluateActorObject(true, false, data),
          popluateActorObject(false, true, data),
        ]).then((pAO: any) => {
          // data = pAO[0].value;
          return Promise.allSettled([
            populate1Cast(true, false, pAO[0].value),
          ]).then((p1c1: any) => {
            return Promise.allSettled([
              populate1Cast(false, true, p1c1[0].value),
            ]).then((p1c2: any) => {
              return Promise.allSettled([compare1Cast(p1c2[0].value)]).then(
                (final: any) => {
                  return final[0].value[1];
                }
              );
            });
          });
        });
      } else {
        return tempArray[1];
      }
    });
  }

  // Second function
  async function getActorCredits(actorID: number): Promise<Array<number>> {
    //API to get an actor and oll of the movies they have been in
    let URL1: string = `https://api.themoviedb.org/3/person/${actorID}/movie_credits?api_key=${API_KEY}&language=en-US`;

    let movie_credit_ids: Array<number> = [];
    await axios.get(URL1).then((response: any) => {
      response.data.cast.forEach((element) => {
        movie_credit_ids.push(element.id);
      });
    });

    return movie_credit_ids;
  }

  // Fourth function
  // modify the main object a nested array
  async function popluateActorObject(
    isActor1: boolean,
    isActor2: boolean,
    data: any
  ) {
    if (isActor1)
      for (let i = 0; i < data[`Movie1IDs`].length; i++)
        await getActorsFromMovie(data[`Movie1IDs`][i]).then(
          (res) =>
            (data[`Movie1IDs`][i] = { mID: data[`Movie1IDs`][i], cast: res })
        );
    else if (isActor2)
      for (let i = 0; i < data[`Movie2IDs`].length; i++)
        await getActorsFromMovie(data[`Movie2IDs`][i]).then(
          (res) =>
            (data[`Movie2IDs`][i] = { mID: data[`Movie2IDs`][i], cast: res })
        );
    else return;
    return data;
  }

  // Fifth function
  // adding the cast to the movies that the perople have been in
  async function populate1Cast(
    isActor1: boolean,
    isActor2: boolean,
    data: any
  ) {
    if (isActor1)
      for (let i = 0; i < data.Movie1IDs.length; i++)
        for (let j = 0; j < data.Movie1IDs[i].cast.length; j++)
          data.Movie1IDs[i].cast[j] = {
            cID: data.Movie1IDs[i].cast[j],
            movies: await getActorCredits(data.Movie1IDs[i].cast[j]),
          };
    else if (isActor2)
      for (let i = 0; i < data.Movie2IDs.length; i++)
        for (let j = 0; j < data.Movie2IDs[i].cast.length; j++)
          data.Movie2IDs[i].cast[j] = {
            cID: data.Movie2IDs[i].cast[j],
            movies: await getActorCredits(data.Movie2IDs[i].cast[j]),
          };

    return data;
  }

  //Last function
  // try to find any similarities
  async function compare1Cast(data: any) {
    let returnArray: Array<any> = [];
    let matched: boolean = false;

    // TODO: fix this loop
    if (data != null || typeof data != 'undefined') {
      loop1: for (let i = 0; i < data.Movie1IDs.length; i++)
        for (let j = 0; j < data.Movie1IDs[i].cast.length; j++)
          for (let l = 0; l < data.Movie1IDs[i].cast[j].movies.length; l++)
            for (let a = 0; a < data.Movie2IDs.length; a++)
              for (let b = 0; b < data.Movie2IDs[a].cast.length; b++)
                for (
                  let c = 0;
                  c < data.Movie2IDs[a].cast[b].movies.length;
                  c++
                )
                  if (
                    data.Movie1IDs[i].cast[j].movies[l] ===
                    data.Movie2IDs[a].cast[b].movies[c]
                  ) {
                    returnArray.push(true);
                    returnArray.push([
                      {
                        prev: { id: data.mainActor1ID, type: 1 },
                        now: { id: data.Movie1IDs[i].mID, type: 2 },
                      },
                      {
                        prev: { id: data.Movie1IDs[i].mID, type: 2 },
                        now: { id: data.Movie1IDs[i].cast[j].cID, type: 1 },
                      },
                      {
                        prev: { id: data.Movie1IDs[i].cast[j].cID, type: 1 },
                        now: {
                          id: data.Movie1IDs[i].cast[j].movies[l],
                          type: 2,
                        },
                      },
                      {
                        prev: {
                          id: data.Movie1IDs[i].cast[j].movies[l],
                          type: 2,
                        },
                        now: { id: data.Movie2IDs[a].cast[b].cID, type: 1 },
                      },
                      {
                        prev: { id: data.Movie2IDs[a].cast[b].cID, type: 1 },
                        now: { id: data.Movie2IDs[a].mID, type: 2 },
                      },
                      {
                        prev: { id: data.Movie2IDs[a].mID, type: 2 },
                        now: { id: data.mainActor2ID, type: 1 },
                      },
                    ]);
                    matched = true;
                    break loop1;
                  }
    }

    if (!matched) returnArray.push(false);

    return returnArray;
  }

  // third function
  // function compares the arrays of the movies that the people have been in
  function checkMainActorIDs(
    actor1ID: number,
    mainActor1MovieIDs: Array<number>,
    actor2ID: number,
    mainActor2MovieIDs: Array<number>
  ) {
    let returnArray = [];

    let isSame = false;

    loop1: for (let i = 0; i < mainActor1MovieIDs.length; i++)
      for (let j = 0; j < mainActor2MovieIDs.length; j++)
        if (mainActor1MovieIDs[i] === mainActor2MovieIDs[j]) {
          returnArray.push(true);
          returnArray.push([
            {
              prev: { id: actor1ID, type: 1 },
              now: { id: mainActor1MovieIDs[i], type: 2 },
            },

            {
              prev: { id: mainActor2MovieIDs[j], type: 2 },
              now: { id: actor2ID, type: 1 },
            },
          ]);
          isSame = true;
          break loop1;
        }

    if (!isSame) {
      let tempID1: Array<number> = [];
      let tempID2: Array<number> = [];

      for (let l = 0; l < mainActor1MovieIDs.length; l++)
        tempID1.push(mainActor1MovieIDs[l]);

      for (let m = 0; m < mainActor2MovieIDs.length; m++)
        tempID2.push(mainActor2MovieIDs[m]);

      returnArray.push(false);
      returnArray.push(tempID1);
      returnArray.push(tempID2);
    }
    return returnArray;
  }

  async function getActorsFromMovie(movie_id: number): Promise<Array<number>> {
    let actor_id_to_compare: any = [];

    await axios
      .get<any>(
        `https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${API_KEY}&language=en-US`
      )
      .then((response) => {
        response.data.cast.forEach((element) => {
          if (element.known_for_department == 'Acting')
            actor_id_to_compare.push(element.id);
        });
      });
    return actor_id_to_compare;
  }

  const btnOnClick = async (event) => {
    // disable the button
    event.target.disabled = true;
    button1.disabled = true;

    // if there was no person selected, add some for the use
    if (selectedID.length == 0) {
      selectedID[0] = 1245;
      selectedID[1] = 6952;
    } else if (selectedID.length == 1)
      selectedID[1] = 6952; // if only one person selected add one actor
    else if (selectedID.length > 1) selectedID.splice(1, selectedID.length - 2); // is there was more than 2 people selected, remove them

    // set a time out so the user doesnt keep comparing, because there will be too many request
    // if the user does have an API key set the time to a low wait time
    let setTimeoutTime: number = 60000; // 60 seconds
    if (hasAPIKey) setTimeoutTime = 1000; // 1 second

    setTimeout(
      (function (button) {
        return function () {
          button.disabled = false;
          event.target.disabled = false;
        };
      })(button1),
      setTimeoutTime
    );

    // start the comparison
    await game().then((answer: any) => {
      // if there was no answer supply  one
      if (answer != null || typeof answer != 'undefined') setResults(answer);
      else
        setResults([
          {
            prev: {
              id: 1245,
              type: 1,
            },
            now: {
              id: 3635,
              type: 2,
            },
          },
          {
            prev: {
              id: 3635,
              type: 2,
            },
            now: {
              id: 1245,
              type: 1,
            },
          },
          {
            prev: {
              id: 1245,
              type: 1,
            },
            now: {
              id: 5038,
              type: 2,
            },
          },
          {
            prev: {
              id: 5038,
              type: 2,
            },
            now: {
              id: 14721,
              type: 1,
            },
          },
          {
            prev: {
              id: 14721,
              type: 1,
            },
            now: {
              id: 9595,
              type: 2,
            },
          },
          {
            prev: {
              id: 9595,
              type: 2,
            },
            now: {
              id: 6952,
              type: 1,
            },
          },
        ]);

      // format the page so the results can be displayed
      sethownResults(false);
      setIsShowCompare(true);

      setActor1GridStart(0);
      setActor1GridEnd(0);
      setActor2GridStart(0);
      setActor2GridEnd(0);
      setResultsGridStart(2);
      setResultsGridEnd(6);

      setCompareGridStart(1);
      setCompareGridEnd(2);
    });
  };

  return (
    <Grid templateColumns='repeat(5, 1fr)' gap={6}>
      {isShowCompare ? (
        <GridItem
          colStart={compareGridStart}
          colEnd={compareGridEnd}
          w='auto'
          h='auto'
        >
          <Box w='100%' h='20rem'>
            <Center>
              <VStack
                divider={<StackDivider borderColor='gray.200' />}
                spacing={4}
                align='stretch'
              >
                <Button
                  onClick={btnOnClick}
                  colorScheme='teal'
                  size='md'
                  // w='50%'
                >
                  Find Simularity
                </Button>
                <Button
                  onClick={() => {
                    // set the page back to default view
                    sethownResults(true);
                    setIsShowCompare(false);

                    setActor1GridStart(4);
                    setActor1GridEnd(5);
                    setActor2GridStart(5);
                    setActor2GridEnd(6);

                    setCompareGridStart(1);
                    setCompareGridEnd(4);
                  }}
                  colorScheme='teal'
                  size='md'
                  ref={(ref) => (button1 = ref)}
                  // w='50%'
                >
                  View Searched Persons
                </Button>
                <p>
                  Pressing View Seatched Persons will show the people that you
                  have just searched for
                </p>
                <p>Or you can just search for another person</p>
              </VStack>
            </Center>
          </Box>
        </GridItem>
      ) : (
        <>
          <GridItem
            colStart={compareGridStart}
            colEnd={compareGridEnd}
            w='auto'
            h='auto'
          >
            <Box w='100%' h='20rem'>
              <Center>
                <VStack
                  divider={<StackDivider borderColor='gray.200' />}
                  spacing={4}
                  align='stretch'
                >
                  <Button
                    onClick={() => {
                      setIsShowCompare(true);
                      setActor1GridStart(0);
                      setActor1GridEnd(0);
                      setActor2GridStart(0);
                      setActor2GridEnd(0);
                    }}
                    colorScheme='teal'
                    size='md'
                  >
                    Compare People
                  </Button>
                  <p>Note: there needs to be two people selected</p>

                  <p>
                    If there are more than two people selected it will only use
                    the first two that were selected
                  </p>
                  <p>How this works:</p>
                  <OrderedList>
                    <ListItem>
                      gets Person 1 and gets all of the movies they have been in
                    </ListItem>
                    <ListItem>1, but for Person 2</ListItem>
                    <ListItem>
                      I Compares the movies they have both been in
                    </ListItem>
                    <ListItem>
                      Get the cast of each movie from Person 1 and 2
                    </ListItem>
                    <ListItem>Compare the cast of the movies</ListItem>

                    <ListItem>Gest the movies of each cast</ListItem>
                    <ListItem>
                      Compare each of the the movies of each cast from Person 1
                      to Person 2
                    </ListItem>

                    <ListItem>Gest the movies of each cast</ListItem>
                  </OrderedList>
                  <p>
                    Note: After each comparison if there are no similar movies,
                    or cast we move onto the next number
                  </p>
                </VStack>
              </Center>
            </Box>
          </GridItem>
        </>
      )}

      {isShownResults ? (
        <>
          <GridItem
            colStart={actor1GridStart}
            colEnd={actor1GridEnd}
            w='auto'
            h='20rem'
          >
            {props.responseData.map((data: any, responseDataIndex: number) => (
              <React.Fragment key={responseDataIndex.toString()}>
                <Center py={6}>
                  <Stack
                    borderWidth='1px'
                    borderRadius='lg'
                    w={{ sm: '100%', md: '540px' }}
                    height={{ sm: '476px', md: '20rem' }}
                    direction={{ base: 'column', md: 'row' }}
                    boxShadow={'2xl'}
                    padding={4}
                  >
                    <Flex flex={1} bg='blue.200'>
                      <Image
                        objectFit='cover'
                        boxSize='100%'
                        src={
                          'https://image.tmdb.org/t/p/w500' + data.profile_path
                        }
                        fallbackSrc='https://via.placeholder.com/150'
                        alt='image of actor'
                      />
                    </Flex>
                    <Stack
                      flex={1}
                      flexDirection='column'
                      justifyContent='center'
                      alignItems='center'
                      p={1}
                      pt={2}
                    >
                      <Heading fontSize={'2xl'} fontFamily={'body'}>
                        {data.name}
                      </Heading>
                      <Text
                        fontWeight={600}
                        color={'gray.500'}
                        size='sm'
                        mb={4}
                      >
                        {getGender(data.gender)} : {data.known_for_department}
                      </Text>
                      <UnorderedList
                        key={`listnumber${data.responseDataIndex + 12}`}
                        width='85%'
                      >
                        {getKnownFor(data.known_for).map(
                          (listitem, mostknownIndex) => (
                            <ListItem
                              key={`movieNo:${mostknownIndex + 15}`}
                              className='list-group-item list-group-item-primary'
                            >
                              <Text>{listitem}</Text>
                            </ListItem>
                          )
                        )}
                      </UnorderedList>
                      <br />
                      <Stack
                        width={'100%'}
                        mt={'2rem'}
                        direction={'row'}
                        padding={2}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Checkbox
                          className='useActor'
                          value={data.id}
                          onChange={checkboxOnChange}
                        >
                          Compare
                        </Checkbox>
                      </Stack>
                    </Stack>
                  </Stack>
                </Center>
              </React.Fragment>
            ))}
          </GridItem>

          <GridItem
            colStart={actor2GridStart}
            colEnd={actor2GridEnd}
            w='auto'
            h='20rem'
          >
            {props.secondResponseData.map(
              (data: any, responseDataIndex: number) => (
                <React.Fragment key={responseDataIndex.toString()}>
                  <Center py={6}>
                    <Stack
                      borderWidth='1px'
                      borderRadius='lg'
                      w={{ sm: '100%', md: '540px' }}
                      height={{ sm: '476px', md: '20rem' }}
                      direction={{ base: 'column', md: 'row' }}
                      boxShadow={'2xl'}
                      padding={4}
                    >
                      <Flex flex={1} bg='blue.200'>
                        <Image
                          objectFit='cover'
                          boxSize='100%'
                          src={
                            'https://image.tmdb.org/t/p/w500' +
                            data.profile_path
                          }
                          fallbackSrc='https://via.placeholder.com/150'
                          alt='image of actor'
                        />
                      </Flex>
                      <Stack
                        flex={1}
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='center'
                        p={1}
                        pt={2}
                      >
                        <Heading fontSize={'2xl'} fontFamily={'body'}>
                          {data.name}
                        </Heading>
                        <Text
                          fontWeight={600}
                          color={'gray.500'}
                          size='sm'
                          mb={4}
                        >
                          {getGender(data.gender)} : {data.known_for_department}
                        </Text>
                        <UnorderedList
                          key={`listnumber${data.responseDataIndex + 12}`}
                          width='85%'
                        >
                          {getKnownFor(data.known_for).map(
                            (listitem, mostknownIndex) => (
                              <ListItem
                                key={`movieNo:${mostknownIndex + 15}`}
                                className='list-group-item list-group-item-primary'
                              >
                                <Text>{listitem}</Text>
                              </ListItem>
                            )
                          )}
                        </UnorderedList>
                        <br />
                        <Stack
                          width={'100%'}
                          mt={'2rem'}
                          direction={'row'}
                          padding={2}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                        >
                          <Checkbox
                            className='useActor2'
                            value={data.id}
                            onChange={checkboxOnChange}
                          >
                            Compare
                          </Checkbox>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Center>
                </React.Fragment>
              )
            )}
          </GridItem>
        </>
      ) : (
        <GridItem
          colStart={resultsGridStart}
          colEnd={resultsGridEnd}
          w='auto'
          h='auto'
        >
          <React.Fragment>
            {isShownResults != null ? (
              <ActorOutputGame id={results} />
            ) : (
              <h2>We could not find any simularities</h2>
            )}
          </React.Fragment>
        </GridItem>
      )}
    </Grid>
  );
};

export default ActorCard;

function getGender(gender: number): string {
  if (gender == 2) return 'Male';
  else if (gender == 1) return 'Female';
}

function getKnownFor(knownFor: Array<{}>): Array<string> {
  let kf: Array<string> = [];

  knownFor.forEach((element: any) => {
    if (typeof element.original_title != 'undefined') {
      kf.push(element.original_title);
    }
  });

  return kf;
}

function formatCastObject(movieCastObject: any): Array<number> {
  let ids: Array<number> = [];
  for (let i = 0; i < movieCastObject[0].cast.length; i++) {
    ids.push(movieCastObject[0].cast[i].id);
  }

  return ids;
}
