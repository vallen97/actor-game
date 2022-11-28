This application is to check how actors or actresses are related to one another.
Example: 
 Robert Downey JR. is related to Jack Black through Tropic Thunder.
This application will only loop through three time.
How this project works:
    1) Get person 1s list of movies
    2) Get person 2s list of movies
        3) Compare the list of movies together
    4) Get the person 1 actors/actresses in each movie
    5) Get the person 2 actors/actresses in each movie
        6) Compare the people together
    7) Get the movies of each person in person 1 movies
    8) Get the movies of each person in person 2 movies
        9) compare the movies of the people in person 1, 2 movies.

This project can keep doing comparisons, but there will be too many requests.

In file .env.example there is a place that will take an API Key from MovieDB
https://www.themoviedb.org/signup , and change the .env.example to .env.local


Demo: https://va-actor-game.herokuapp.com/
