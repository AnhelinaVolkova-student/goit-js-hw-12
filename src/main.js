import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import { searchPhoto } from "./js/pixabay-api";
import { galleryRender } from "./js/render-functions";
import { clearGallery } from "./js/render-functions";
import { showLoader } from "./js/render-functions";
import { hideLoader } from "./js/render-functions";

const searchForm = document.querySelector("form");
const searchInput = document.querySelector('input');

const error = new Error();

searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const inputValue = searchInput.value.trim();
    if (inputValue === '') {
        hideLoader();
        error.code = 'EMPTY_FIELD';
        throw error;
        return;
    }
    clearGallery();
    showLoader();
    searchPhoto(inputValue)
        .then((hits) => {
            galleryRender(hits);
        })
        .catch(error => {
            if (error.code === 'NO_IMAGES') {
                iziToast.error({
                    message: 'Sorry, there are no images matching your search query. Please try again!',
                });
            } else if (error.code === 'EMPTY_FIELD') {
                iziToast.error({
                    message: "Field can't be empty."
                });
            } else {
                iziToast.error({
                    message: "Something went wrong. Please try again later."
                });
                console.error(error);
            }
        })
        .finally(() => {
            hideLoader();
        });
});


