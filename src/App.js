import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import MovieList from "./components/MovieList";
import MovieListHeading from "./components/MovieListHeading";
import SearchBox from "./components/SearchBox";
import AddFavourite from "./components/AddToFavourites";
import RemoveFavourite from "./components/RemoveFavourites";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [favourites, setFavourites] = useState([]);

  const addFavouriteMovie = (movie) => {
    const id = movie.imdbID;

    if (!favourites.some((favourite) => favourite.imdbID === id)) {
      const newFavouritelist = [...favourites, movie];
      setFavourites(newFavouritelist);
      saveToLocalStorage(newFavouritelist);
    }
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouritelist = favourites.filter(
      (favourite) => favourite.imdbID !== movie.imdbID
    );
    setFavourites(newFavouritelist);
    saveToLocalStorage(newFavouritelist);
  };

  const saveToLocalStorage = (items) => {
    localStorage.setItem("react-movie-app-favourites", JSON.stringify(items));
  };

  const getMovieRequest = async (searchValue) => {
    const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;

    const response = await fetch(url);
    const responseJson = await response.json();

    if (responseJson.Search) {
      setMovies(responseJson.Search);
    }
  };

  useEffect(() => {
    const movieFavourites = JSON.parse(
      localStorage.getItem("react-movie-app-favourites")
    );
    console.log(movieFavourites);
    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  useEffect(() => {
    getMovieRequest(searchValue);
  }, [searchValue]);

  return (
    <div className="container-fluid movie-app">
      <MovieListHeading heading="Movies" />
      <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />

      <div className="row">
        <MovieList
          movies={movies}
          favouriteComponent={AddFavourite}
          handleClick={addFavouriteMovie}
        />
      </div>
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Favourites" />
      </div>
      <div className="row">
        <MovieList
          movies={favourites}
          favouriteComponent={RemoveFavourite}
          handleClick={removeFavouriteMovie}
        />
      </div>
    </div>
  );
};

export default App;
