// export const getData = async function () {

//     try {

//         const response = await fetch("https://www.omdbapi.com/?apikey=fe074070&s=batman");

//         if (!response.ok) {
//             throw new Error(`Https error ! status: ${response.status}`)
//         }

//         const data = await response.json();
//         // console.log("Data: ", data)

//         return data;

//     } catch (err) {

//         throw new Error(`Something went wrong : ${err}`)

//     }
// }


// export const fetchData = async function (url) {
//     try {

//         const res = await fetch(url);
//         if (!res.ok) {
//             throw new Error(`Somehing went wrong!!! ${res.status}`)
//         }
//         const data = res.json();
//         return data;

//     } catch (err) {
//         console.log("the errror:", err);
//         throw new Error(`Something went wrong : ${err}`)
//     }

// }


// src/api.js
const API_KEY = '8f0dfea8a2802b58251c157f7a6b1916'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w342';

export async function fetchPopular(limit = 20) {
    const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=1`;
    return fetchMovies(url, limit);
}

export async function searchMovies(query, limit = 20) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`;
    return fetchMovies(url, limit);
}

async function fetchMovies(url, limit) {
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('HTTP ' + res.status);

        const data = await res.json();
        if (!data.results) throw new Error('Invalid response');

        return data.results.slice(0, limit).map((movie) => ({
            id: movie.id,
            title: movie.title,
            year: (movie.release_date || '').split('-')[0],
            poster: movie.poster_path
                ? IMAGE_BASE + movie.poster_path
                : 'https://via.placeholder.com/342x513?text=No+Image',
        }));
    } catch (err) {
        throw new Error('Failed to fetch movies');
    }
}
