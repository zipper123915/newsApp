
// * variables
const http = getAjax();
const  country = document.querySelector('.search-panel__country').value;
const newsService = (function () {
    const apiUrl = 'http://newsapi.org/v2';
    const apiKey = '9b40b8084cb74317ac47e435b87d7c78';

    return {
        everything(query, callback) {
            http.get({
                url: `https://newsapi.org/v2/everything?q=${query}&apiKey=9b40b8084cb74317ac47e435b87d7c78&pageSize=30`,
                success: callback
            })
        },
        topHeadLines(country, callback) {
            http.get({
                url: `https://newsapi.org/v2/top-headlines?country=${country}&category=technology&apiKey=9b40b8084cb74317ac47e435b87d7c78&pageSize=30`,
                success: callback
            })
        }
    };
}());
// * HtmlElements
const newsContainer = document.querySelector('.news-container');
const sendButton = document.querySelector('.search-panel__button');

// * calls
newsService.topHeadLines(country, (error, { articles } ) => {

    console.log(articles);
    newsContainer.prepend(renderArticlis(articles));
});
sendButton.addEventListener('click', () => {
   const  country = document.querySelector('.search-panel__country').value;
   const search = document.querySelector('.search-panel__search').value;
    console.log(country)
   if (search) {
       newsService.everything(search, (error, { articles }) => {
           newsContainer.prepend(renderArticlis(articles));
       })
   } else {
       newsService.topHeadLines(country, (error, { articles }) => {
           newsContainer.prepend(renderArticlis(articles))
       })
   }
});

// * functions
function cardTampalate({title, urlToImage, description, url}) {
    let res = document.createElement('div');
    res.classList.add('card');

    res.insertAdjacentHTML('afterbegin', `<img src="${urlToImage}" class="card-img-top">`)

    const body = document.createElement('div');
    body.classList.add('card-body');
    body.insertAdjacentHTML('beforeend', `<h4 class="card-title">${title}</h4>
                                                      <div class="card-text">${description}</div>
                                                      <a class="btn mt-3 btn-danger" target="_blank" href="${url}">Читать</a>`);
    res.appendChild(body);

    return res
}

function getAjax() {
    return {
        post({url, body, headers = {}, success: callback}) {
            let xhr = new XMLHttpRequest();

            xhr.open('POST', url);

            xhr.addEventListener('load', () => {
                if (Math.floor(xhr.status / 100) !== 2) {
                    callback(`Error ${xhr.status}`, xhr);
                    return;
                }

                callback(xhr.status, JSON.parse(xhr.responseText));
            });

            xhr.addEventListener('error', () => {
                console.log('Incorrect connection')
            });

            for (let key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }

            xhr.send(JSON.stringify(body))
        },
        get({url, success: callback}) {
            let xhr = new XMLHttpRequest();

            xhr.open('GET', url);

            xhr.addEventListener('load', () => {
                if (Math.floor(xhr.status / 100) !== 2) {
                    callback(`Error ${xhr.status}`, xhr);
                    return;
                }

                callback(xhr.status, JSON.parse(xhr.responseText));
            });


            xhr.addEventListener('error', () => {
                console.log('Incorrect connection')
            });

            xhr.send()
        }
    }
}

function renderArticlis(articles) {
    const frag = document.createDocumentFragment();

    articles.forEach((article, index, array) => {
        for (let key in article) {
            if (!article[key] && article.author && article.content) array.splice(index, 1);
        }
    });

    articles.forEach(article => {
        const el = cardTampalate(article);
        frag.appendChild(el);
    });
    newsContainer.innerHTML = '';
    return frag;

}
