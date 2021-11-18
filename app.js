const auth = API_KEY;

const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const loader = document.querySelector('.loader');

let searchValue;
let page = 1;
let queryState = "";
let loading = true;

searchInput.addEventListener('input', updateInput);
form.addEventListener('submit', (e) => {
    e.preventDefault();
    searchPhotos(searchValue);
});
document.addEventListener("DOMContentLoaded", checkIfIntersecting);

function checkIfIntersecting() {
    let options = {
        root: null,
        rootMargin: "0px",
        threshold: 0.25
    };

    function handleIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting && loading === false) {
                loadMore()
            }
        });
    }

    let observer = new IntersectionObserver(handleIntersect,
        options);
    observer.observe(loader);
}


function updateInput(e) {
    searchValue = e.target.value
}

async function fetchApi(url) {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", auth);
    myHeaders.append("Accept", "application/json");

    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    };
    const dataFetch = await fetch(url, requestOptions);
    return await dataFetch.json();
}

function renderPictures(result) {
    result.photos.forEach(photo => {
        const galleryImg = document.createElement('div');
        galleryImg.classList.add('gallery-img');
        galleryImg.innerHTML = `
                       <div class="gallery-item">
                       <img src="${photo.src.large}" width="300" height="400" loading="lazy" alt="${photo.photographer} photograph"/>
                           <h4 id="photographer">Created by: ${photo.photographer}</h4>
                           <div class="gallery-info">
                                <a href=${photo.src.original} rel="nofollow" download="${photo.photographer}-original" target="_blank">Original</a>
                                <a href=${photo.src.small} rel="nofollow" download="${photo.photographer}-small" target="_blank">Small</a>
                                <a href=${photo.src.medium} rel="nofollow" download="${photo.photographer}-medium" target="_blank">Medium</a>
                                <a href=${photo.src.large} rel="nofollow" download="${photo.photographer}-large" target="_blank">Large</a>
                            </div>
                       </div>
                       `;
        gallery.appendChild(galleryImg);
    })
    loading = false
}

async function curatedPhotos() {
    loading = true
    try {
        const result = await fetchApi("https://api.pexels.com/v1/curated?per_page=20&page=1");
        renderPictures(result)
    } catch (e) {
        console.log(e)
        alert("Oops! Something went wrong please refresh and try again!")
    }
}

async function searchPhotos(query) {
    loading = true
    clear();
    queryState = query
    try {
        const result = await fetchApi(`https://api.pexels.com/v1/search?query=${query}+query&per_page=20&page=1`)
        renderPictures(result)
    } catch (e) {
        console.log(e)
        alert("Oops! Something went wrong please refresh and try again!")
    }
}

function clear() {
    gallery.innerHTML = '';
    searchInput.value = '';
}

async function loadMore() {
    loading = true
    page++;
    let result = [];
    try {
        if (queryState !== "") {
            result = await fetchApi(`https://api.pexels.com/v1/search?query=${queryState}+query&per_page=20&page=${page}`)
        } else {
            result = await fetchApi(`https://api.pexels.com/v1/curated?per_page=20&page=${page}`);
        }
        renderPictures(result);
    } catch (e) {
        console.log(e)
        alert("Oops! Something went wrong please refresh and try again!")
    }
}


curatedPhotos();



