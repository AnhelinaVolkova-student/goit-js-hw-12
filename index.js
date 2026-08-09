import{r as e}from"./assets/rolldown-runtime-hePW80VL.js";import{n as t,r as n,t as r}from"./assets/vendor-DjMoOC5B.js";(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var i=e(n(),1),a=async(e,n)=>(await t.get(`https://pixabay.com/api/`,{params:{key:`56969779-79703cf16e75705543728b96e`,q:e,image_type:`photo`,orientation:`horizontal`,safesearch:`true`,per_page:15,page:n}})).data;async function o(e,t){let n=await a(e,t);if(n.hits.length)return n;{let e=Error();throw e.code=`NO_IMAGES`,e}}var s=e(r(),1),c=s.default.default??s.default,l=document.querySelector(`.gallery`),u=new c(`.gallery-link`);function d(e){let t=e.map(e=>`<li class="galleryItemForm">
            <a class="gallery-link" href = "${e.largeImageURL}">    
                <img
                    src= "${e.webformatURL}"
                    alt= "${e.tags}"/>
                <ul class="galleryItemData">
                    <li>
                        <p> Likes </p>
                        <p>${e.likes}</p>
                    </li>
                    <li>
                        <p> Views</p>
                        <p>${e.views}</p>
                    </li>
                    <li>
                        <p> Comments </p>
                        <p>${e.comments}</p>
                    </li>
                    <li>
                        <p>Downloads</p>
                        <p>${e.downloads}</p>
                    </li>
                </ul>
            </a>
        </li> `).join(``);l.insertAdjacentHTML(`beforeend`,t),u.refresh()}function f(){l.innerHTML=``}var p=document.querySelector(`.loader`);function m(){p.style.display=`block`}function h(){p.style.display=`none`}var g=document.querySelector(`[type="button"]`);function _(){g.style.display=``}function v(){g.style.display=`none`}var y=document.querySelector(`form`),b=document.querySelector(`input`),x=document.querySelector(`.loadMoreButton`);v();var S=1,C=``;y.addEventListener(`submit`,async e=>{e.preventDefault(),f(),v(),S=1;try{C=await E(b.value)}catch(e){(e.vode=`EMPTY_FIELD`)?(i.default.error({message:`Field can't be empty.`}),console.error(e)):(i.default.error({message:`Something went wrong. Please try again later.`}),console.error(e))}w(C,S)}),x.addEventListener(`click`,e=>{e.preventDefault(),S+=1,w(C,S),v()});var w=async(e,t)=>{try{m(),v(),await T(await o(e,t),t)}catch(e){switch(e.code){case`NO_IMAGES`:i.default.error({message:`Sorry, there are no images matching your search query. Please try again!`}),console.error(e);break;case`MAX_PAGES`:i.default.error({message:`We're sorry, but you've reached the end of search results.`}),console.error(e);break;default:i.default.error({message:`Something went wrong. Please try again later.`}),console.error(e)}}finally{h()}},T=async(e,t)=>{let n=e.totalHits,r=e.per_page;if(Math.ceil(n/r)<=t){v();let e=Error();throw e.code=`MAX_PAGES`,e}{d(e.hits);let t=document.querySelector(`.gallery-link`).getBoundingClientRect().height*2;window.scrollBy({top:t,behavior:`smooth`}),_()}},E=async e=>{let t=e.trim();if(t===``){let e=Error();throw e.code=`EMPTY_FIELD`,e}return t};
//# sourceMappingURL=index.js.map