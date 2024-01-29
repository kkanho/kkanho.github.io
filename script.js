// for programming language icons
const devicons = {
    Git: '<i class="devicon-git-plain" style="color: #555"></i>',
    Github: '<i class="devicon-github-plain" ></i>',
    Chrome: '<i class="devicon-chrome-plain" ></i>',
    Assembly: '<i class="devicon-labview-plain colored"></i> Assembly',
    'C#': '<i class="devicon-csharp-plain colored"></i> C#',
    'C++': '<i class="devicon-cplusplus-plain colored"></i> C++',
    C: '<i class="devicon-c-plain colored"></i> C',
    Clojure: '<i class="devicon-clojure-plain colored"></i> C',
    CoffeeScript:
        '<i class="devicon-coffeescript-plain colored"></i> CoffeeScript',
    Crystal: '<i class="devicon-crystal-plain colored"></i> Crystal',
    CSS: '<i class="devicon-css3-plain colored"></i> CSS',
    Dart: '<i class="devicon-dart-plain colored"></i> Dart',
    Dockerfile: '<i class="devicon-docker-plain colored"></i> Docker',
    Elixir: '<i class="devicon-elixir-plain colored"></i> Elixir',
    Elm: '<i class="devicon-elm-plain colored"></i> Elm',
    Erlang: '<i class="devicon-erlang-plain colored"></i> Erlang',
    'F#': '<i class="devicon-fsharp-plain colored"></i> F#',
    Go: '<i class="devicon-go-plain colored"></i> Go',
    Groovy: '<i class="devicon-groovy-plain colored"></i> Groovy',
    HTML: '<i class="devicon-html5-plain colored"></i> HTML',
    Haskell: '<i class="devicon-haskell-plain colored"></i> Haskell',
    Java: '<i class="devicon-java-plain colored" style="color: #ffca2c"></i> Java',
    JavaScript: '<i class="devicon-javascript-plain colored"></i> JavaScript',
    Julia: '<i class="devicon-julia-plain colored"></i> Julia',
    'Jupyter Notebook': '<i class="devicon-jupyter-plain colored"></i> Jupyter',
    Kotlin: '<i class="devicon-kotlin-plain colored" style="color: #796bdc"></i> Kotlin',
    Latex: '<i class="devicon-latex-plain colored"></i> Latex',
    Lua: '<i class="devicon-lua-plain-wordmark colored" style="color: #0000d0"></i> Lua',
    Matlab: '<i class="devicon-matlab-plain colored"></i> Matlab',
    Nim: '<i class="devicon-nixos-plain colored" style="color: #FFC200"></i> Nim',
    Nix: '<i class="devicon-nixos-plain colored"></i> Nix',
    ObjectiveC: '<i class="devicon-objectivec-plain colored"></i> ObjectiveC',
    OCaml: '<i class="devicon-ocaml-plain colored"></i> OCaml',
    Perl: '<i class="devicon-perl-plain colored"></i> Perl',
    PHP: '<i class="devicon-php-plain colored"></i> PHP',
    PLSQL: '<i class="devicon-sqlite-plain colored"></i> PLSQL',
    Processing:
        '<i class="devicon-processing-plain colored" style="color: #0096D8"></i> Processing',
    Python: '<i class="devicon-python-plain colored" style="color: #3472a6"></i> Python',
    R: '<i class="devicon-r-plain colored"></i> R',
    Ruby: '<i class="devicon-ruby-plain colored"></i> Ruby',
    Rust: '<i class="devicon-rust-plain colored" style="color: #DEA584"></i> Rust',
    Sass: '<i class="devicon-sass-original colored"></i> Sass',
    Scala: '<i class="devicon-scala-plain colored"></i> Scala',
    Shell: '<i class="devicon-bash-plain colored" style="color: #89E051"></i> Shell',
    Solidity: '<i class="devicon-solidity-plain colored"></i> Solidity',
    Stylus: '<i class="devicon-stylus-plain colored"></i> Stylus',
    Svelte: '<i class="devicon-svelte-plain colored"></i> Svelte',
    Swift: '<i class="devicon-swift-plain colored"></i> Swift',
    Terraform: '<i class="devicon-terraform-plain colored"></i> Terraform',
    TypeScript: '<i class="devicon-typescript-plain colored"></i> TypeScript',
    'Vim Script': '<i class="devicon-vim-plain colored"></i> Vim Script',
    Vue: '<i class="devicon-vuejs-plain colored"></i> Vue'
};

const maxPages = 3;
const hideForks = true;
const repoList = document.querySelector('.repo-list');
const reposSection = document.querySelector('.repos');
const filterInput = document.querySelector('.filter-repos');

// get information from github profile
const getProfile = async () => {
    const expiry = Date.now() + 30 * 60 * 1000; // Set the profile with an expiry time of 30 minutes
    const res = await fetch("https://api.github.com/users/kkanho");
    const profile = await res.json();
    localStorage.setItem('profile', JSON.stringify({ value: profile, expiry }));
    displayProfile(profile);
};

// display information from github profile
const displayProfile = (profile) => {
    const userInfo = document.querySelector('.user-info');
    userInfo.innerHTML = `
        <a href="https://github.com/kkanho">    
            <figure>
                <img alt="Kan's avatar" src=${profile.avatar_url ? profile.avatar_url : "https://st3.depositphotos.com/9998432/13335/v/450/depositphotos_133352064-stock-illustration-default-placeholder-profile-icon.jpg"} />
            </figure>
        </a>
        <div>
            <h2><a href=${profile.blog}><strong>${profile.name}</strong></a></h2>
            <p>${profile.bio}</p>
            <p>
                <strong>Location:</strong> ${profile.location}
            </p>
            <p>
                <a href="https://github.com/kkanho"><strong>@${profile.login} </strong></a>
                Repos: ${profile.public_repos}
                Gists: ${profile.public_gists}
            </p>
        </div>
    `;
};

// Get the profile and check if it has expired
if (localStorage.getItem('profile')) {
    const profile = JSON.parse(localStorage.getItem('profile')); // Get the profile from local storage
    if (profile) {
        if (Date.now() >= profile.expiry) { //clear the profile if the profile has expired
            localStorage.removeItem('profile'); // Remove the expired profile from localStorage
            getProfile() // get it from fetch
        } else {
            displayProfile(profile.value);    //display it
        }
    }
} else { //profile not found in localStorage
    getProfile() // Fetch the profile from the server
}

// get list of public repos
const getRepos = async () => {
    const expiry = Date.now() + 30 * 60 * 1000; // Set the profile with an expiry time of 30 minutes
    let repos = [];
    let res;
    for (let i = 1; i <= maxPages; i++) {
        res = await fetch(`https://api.github.com/users/kkanho/repos?&sort=pushed&per_page=100&page=${i}`);
        let data = await res.json();
        repos = repos.concat(data);
    }
    repos.sort((a, b) => b.forks_count - a.forks_count);
    repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    localStorage.setItem('repos', JSON.stringify({ value: repos, expiry }));
    displayRepos(repos);
};
// getRepos();

// display list of all public repos
const displayRepos = (repos) => {
    const userHome = "https://github.com/kkanho";
    filterInput.classList.remove('hide');
    for (const repo of repos) {
        if (repo.fork && hideForks) {
            continue;
        }

        const langUrl = `${userHome}?tab=repositories&q=&language=${repo.language}`;
        const starsUrl = `${userHome}/${repo.name}/stargazers`;
        const forksUrl = `${userHome}/${repo.name}/network/members`;

        const cardTitle = "cardTitle"
        const cardDescription = "cardDescription"
        const cardGroup = "cardGroup"
        const cardBtns = "cardBtns"

        let listItem = document.createElement('div');
        listItem.classList.add('card');
        listItem.innerHTML = `
            <h5 class=${cardTitle}>${repo.name}</h5>
            <div class=${cardDescription}>${repo.description == null ? 'Project Description' : repo.description}</div>
            <div class=${cardGroup}>
                ${(repo.stargazers_count > 0) ? `<a href="${starsUrl}">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFD438" class="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    ${repo.stargazers_count}
                </span></a>`: ''}
                ${(repo.language) ? `<a href="${langUrl}">
                <span>${devicons[repo.language]}</span></a>` : ''}
                ${(repo.forks_count > 0) ? `<a href="${starsUrl}">
                <span>${devicons['Git']} ${repo.forks_count}</span></a>` : ''}
            </div>
        `;

        if (repo.homepage && repo.homepage !== '') {
            listItem.innerHTML += `
            <div class=${cardBtns}>
                <a class="link-btn" href=${repo.html_url}>Code ${devicons['Github']}</a>
                <a class="link-btn" href=${repo.homepage}>Live ${devicons['Chrome']}</a>
            </div>`;
        } else if (repo.html_url) {
            listItem.innerHTML += `
            <a class="link-btn" href=${repo.html_url}>View Project ${devicons['Github']}</a>`;
        }

        repoList.append(listItem);
    }
};

// Get the repos and check if it has expired
if (localStorage.getItem('repos')) {
    const repos = JSON.parse(localStorage.getItem('repos')); // Get the repos from local storage
    if (repos) {
        if (Date.now() >= repos.expiry) { //clear the repos if the repos has expired
            localStorage.removeItem('repos'); // Remove the expired repos from localStorage
            getRepos() // get it from fetch
        } else {
            displayRepos(repos.value);    //display it
        }
    }
} else { //repos not found in localStorage
    getRepos() // Fetch the repos from the server
}

// dynamic search
filterInput.addEventListener('input', (e) => {
    const search = e.target.value;
    const repos = document.querySelectorAll('.card');
    const searchLowerText = search.toLowerCase();

    for (const repo of repos) {
        const lowerText = repo.innerText.toLowerCase();
        if (lowerText.includes(searchLowerText)) {
            repo.classList.remove('hide');
        } else {
            repo.classList.add('hide');
        }
    }
});


// Back to Top button:
let mybutton = document.getElementById("backToTopBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTo({top: 0, behavior: 'smooth'}); // For Safari
    document.documentElement.scrollTo({top: 0, behavior: 'smooth'}); // For Chrome, Firefox, IE and Opera
}