import { useEffect, useState } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner"
import MovieCard from "./components/MovieCard"
import { useDebounce } from "react-use"
import { updateSearchCount, getTrendingMovies } from "./appwrite"

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [movieList, setMovieList] = useState([])
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const result = await response.json();

      if(result.Response === "False") {
        setErrorMessage(result.Error || "Error fetching movies, please try again.");
        setMovieList([]);
        return;
      } else {
        setMovieList(result.results || []);
        // if (query && result.results.length > 0) {
        //   await updateSearchCount(query, result.results[0]);
        // }
      }
    } catch (error) {
      console.log(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies, please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // const loadTrendingMovies = async () => {
  //   try {
  //     const movies = await getTrendingMovies();
  //     setTrendingMovies(movies);
  //   } catch (error) {
  //     console.log(`Error fetching trending movies: ${error}`);
  //   }
  // }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm])

  // useEffect(() => {
  //   loadTrendingMovies();
  // }, [])

  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Movies <span className="text-gradient">Galore</span></h1>
            <p className="text-white text-lg text-center">Search for movies you'll enjoy without the hassle</p>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
          </header>
          <section className="all-movies">
            {trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>
                <ul className="flex flex-row overflow-y-auto gap-5 -mt-10 w-full hide-scrollbar">
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
              )}
            <h2>All Movies</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul className="grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {movieList.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default App