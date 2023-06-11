//TMDB 

const API_KEY = 'api_key=03c4e3dc470296959d6bf68804146538';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY+'&language=pt-BR';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
const searchURL = BASE_URL + '/search/movie?'+API_KEY+'&language=pt-BR';

const genres = [
    {
      "id": 28,
      "name": "Ação"
    },
    {
      "id": 12,
      "name": "Aventura"
    },
    {
      "id": 16,
      "name": "Animação"
    },
    {
      "id": 35,
      "name": "Comédia"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentário"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Família"
    },
    {
      "id": 14,
      "name": "Fantasia"
    },
    {
      "id": 36,
      "name": "História"
    },
    {
      "id": 27,
      "name": "Terror"
    },
    {
      "id": 10402,
      "name": "Música"
    },
    {
      "id": 9648,
      "name": "Mistério"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Ficção Científica"
    },
    {
      "id": 10770,
      "name": "Filme de TV"
    },
    {
      "id": 53,
      "name": "Suspense"
    },
    {
      "id": 10752,
      "name": "Guerra"
    },
    {
      "id": 37,
      "name": "Faroeste"
    }
  ];

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastUrl = '';
var totalPages = 100;

var selectedGenre = [];
setGenre();
function setGenre() {
    tagsEl.innerHTML= '';
    genres.forEach(genre => {
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id=genre.id;
        t.innerText = genre.name;
        t.addEventListener('click', () => {
            if(selectedGenre.length == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx) => {
                        if(id == genre.id){
                            selectedGenre.splice(idx, 1);
                        }
                    });
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre)
            getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(','))+'&page='+currentPage);
            highlightSelection();
        })
        tagsEl.append(t);
    })
}

function highlightSelection(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn();
    if(selectedGenre.length !=0){
        selectedGenre.forEach(id => {
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add('highlight');
        });
    }
}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');
    }else{
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Limpar';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();
            getMovies(API_URL+'&page='+currentPage);
        })
        tagsEl.append(clear);
    }
}

getMovies(API_URL+'&page='+currentPage);

function getMovies(url) {
    lastUrl = url;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data.results.length !== 0){
            showMovies(data.results)
            currentPage = data.page
            nextPage = currentPage + 1
            prevPage = currentPage - 1
            totalPages = data.total_pages

            current.innerText = currentPage;

            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            }else if(currentPage >= totalPages){
                prev.classList.remove('disabled');
                next.classList.add('disabled');
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled');
            }

            form.scrollIntoView({behavior: 'smooth'})
        }else{
            main.innerHTML = `<h1 class="no-results">Sem resultados encontrados</h1>`
        }
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const { title, poster_path, vote_average, overview } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');

        movieEl.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Sinopse:</h3>
                ${overview}
                <br/>
                <button class="know-more" id="${movie.id}">Saiba Mais</button>
            </div>
        `;

        main.appendChild(movieEl);

        document.getElementById(movie.id).addEventListener('click', () => {
            openNav(movie)
        })
    })
}

function openNav(movie) {
    fetch(BASE_URL + '/movie/' + movie.id + '/videos?'+API_KEY+'&language=pt-BR')
    .then(res => res.json())
    .then(videoData => {
        console.log(videoData)
        if(videoData.results.length !== 0){
            const video = videoData.results[0];
            overlayContent.innerHTML = `
            <div class="close-btn" onclick="closeNav()"><i class="fas fa-times"></i></div>
            <iframe 
                src="https://www.youtube.com/embed/${video.key}"
                frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
            </iframe>
            `
        }else{
            overlayContent.innerHTML = `
            <div class="close-btn" onclick="closeNav()"><i class="fas fa-times"></i></div>
            <h1>Não foi possível encontrar o trailer</h1>
            `
        }
    })
    overlay.style.width = "100%";
}

function closeNav() {
    overlay.style.width = "0%";
    overlayContent.innerHTML = '';
}

function getColor(vote) {
    if(vote >= 8){
        return 'green'
    }else if(vote >= 5){
        return 'orange'
    }else{
        return 'red'
    }
}

prev.addEventListener('click', () => {
    if(prevPage > 0){
        pageCall(prevPage);
    }
})

next.addEventListener('click', () => {
    if(nextPage <= totalPages){
        pageCall(nextPage);
    }
})

function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
        let url = lastUrl + '&page='+page
        getMovies(url);
    }else{
        key[1] = page.toString();
        let a = key.join('=');
        queryParams[queryParams.length -1] = a;
        let b = queryParams.join('&');
        let url = urlSplit[0] + '?' + b
        getMovies(url);
    }
}
