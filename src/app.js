
// import { debounce } from "./debounce.js";
// import { fetchData, getData } from "./api.js";
// let state = {
//     status: "idle",          // "idle" | "loading" | "success" | "empty" | "error"
//     items: [],               // current list (≤ 20)
//     errorMessage: "",        // short user-facing message
//     favorites: [],           // persisted
//     mode: "popular",         // "popular" | "search"
//     lastQuery: ""            // for rendering the heading
// };

// const el = {
//     q: document.getElementById("q"),
//     list: document.getElementById("results"),
//     status: document.getElementById("status"),
//     retry: document.getElementById("retry")
// }



// let dotsTimerId = null;
// let dots = 0;



// const value = await getData();
// console.log("The data from. app.js:", value)




// function setState(next) {
//     state = { ...state, ...next }
//     render()
// }


// function startLoadingDots() {
//     stopLoadingDots();
//     dots = 0;
//     dotsTimerId = setInterval(() => {
//         dots = (dots + 1) % 4
//         el.status.textContent = "loading" + ".".repeat(dots);
//     }, 500)
// }

// function stopLoadingDots() {
//     if (dotsTimerId) {
//         clearInterval(dotsTimerId)
//         dotsTimerId = null;
//         dots = 0
//     }
// }


// function render() {
//     if (state.status === "idle") {
//         stopLoadingDots();
//         el.status.textContent = state.message;
//     } else if (state.status === "loading") {
//         startLoadingDots();

//     }
//     else if (state.status === "success") {
//         stopLoadingDots();
//         el.status.textContent = state.message;
//     }
//     else if (state.status === "empty") {
//         stopLoadingDots();
//         el.status.textContent = state.message;
//     } else {
//         stopLoadingDots();
//         el.status.textContent = state.message;
//     }
//     if (state.status === "success") {
//         el.list.replaceChildren(...state.items.map(makeLi))
//     }
//     else {
//         el.list.replaceChildren()
//     }
//     el.retry.hidden = state.status !== "error"
// }



// const onType = debounce(async (e) => {
//     const query = e.target.value.trim();
//     if (!query) {
//         console.log("Pls input your response")
//     } else if (query.length < 2) [
//         console.log("Pls add more character")
//     ]
//     setState({
//         status: "loading", items: [], message: ""
//     })


//     try {

//         const url = `https://www.omdbapi.com/?apikey=fe074070&s=${encodeURIComponent(query)}`;
//         const data = await fetchData(url);

//         console.log("the data of the searched item is :", data)
//         // console.log(data.docs);
//         console.log("Hi")

//         // const docs = data.docs;
//         if (docs.length === 0) {
//             setState({ status: "empty", items: [], message: "No Items Found" })
//         } else {
//             setState({ status: "success", items: docs, message: `${docs.length} items found` })
//         }


//     } catch (err) {
//         console.log("Search failed")
//     }
// })

// el.q.addEventListener("input", onType);


// function makeLi(item) {
//     const li = document.createElement("li");
//     li.textContent = item.title;
//     return li;
// }

// setState({ phase: "idle", items: [], message: "type something to start" })




import { debounce } from "./debounce.js";
import { fetchPopular, searchMovies } from "./api.js";
import { loadFavorites, saveFavorites, toggleFavorite } from "./favorites.js";

const state = {
    status: "idle",
    items: [],
    errorMessage: "",
    favorites: loadFavorites(),
    mode: "popular",
    lastQuery: ""
};

const el = {
    q: document.getElementById("q"),
    list: document.getElementById("results"),
    status: document.getElementById("status"),
    retry: document.getElementById("retry"),
    favorites: document.getElementById("favorites")
};

function setState(next) {
    Object.assign(state, next);
    render();
}

async function loadPopular() {
    setState({ status: "loading", items: [], message: "" });
    try {
        const items = await fetchPopular();
        setState({
            status: items.length ? "success" : "empty",
            items,
            message: items.length ? "Popular Movies" : "No movies found",
            mode: "popular"
        });
    } catch (err) {
        setState({ status: "error", message: err.message });
    }
}

const onType = debounce(async (e) => {
    const query = e.target.value.trim();
    if (!query) return loadPopular();

    setState({ status: "loading", items: [], message: "", mode: "search", lastQuery: query });

    try {
        const items = await searchMovies(query);
        setState({
            status: items.length ? "success" : "empty",
            items,
            message: items.length ? `Results for: "${query}"` : "No results found"
        });
    } catch (err) {
        setState({ status: "error", message: err.message });
    }
}, 400);

el.q.addEventListener("input", onType);
el.retry.addEventListener("click", () => {
    if (state.mode === "popular") loadPopular();
    else onType({ target: { value: state.lastQuery } });
});

function render() {
    const { status, items, message, favorites } = state;

    el.status.textContent = message;
    el.retry.hidden = status !== "error";

    if (status === "success") {
        el.list.replaceChildren(...items.map(makeCard));
    } else {
        el.list.innerHTML = "";
    }

    el.favorites.replaceChildren(...favorites.map(makeCard));
}

function makeCard(movie) {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = movie.poster;
    img.alt = movie.title;

    const h3 = document.createElement("h3");
    h3.textContent = `${movie.title} (${movie.year || "N/A"})`;

    const btn = document.createElement("button");
    const isFav = state.favorites.some((f) => f.id === movie.id);
    btn.textContent = isFav ? "Remove Favorite" : "Add Favorite";
    btn.onclick = () => {
        const updated = toggleFavorite(movie);
        setState({ favorites: updated });
    };

    li.append(img, h3, btn);
    return li;
}

// Initial load
loadPopular();
