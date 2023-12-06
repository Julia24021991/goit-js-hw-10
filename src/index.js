import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'slim-select/dist/slimselect.css';

const select = document.querySelector('.breed-select');
const catsInfo = document.querySelector('.cat-info');
const loader = document.querySelector('.loader');

Notify.init({
    position: 'center-top',
    distance: '70px',
    timeout: 3000,
    cssAnimationStyle: 'zoom',
    fontFamily: 'Arial, sans-serif',
});

select.classList.add('is-hidden');
catsInfo.classList.add('is-hidden');

select.addEventListener('change', selectChangeHandler);

showFetchedBreeds();

function selectChangeHandler(event) {
    const selectedCatIndex = event.currentTarget.selectedIndex;
    const selectedId = event.currentTarget[selectedCatIndex].value;

    loader.classList.remove('is-hidden');
    catsInfo.classList.add('is-hidden');
    catsInfo.innerHTML = '';

    showFetchedCatBreed(selectedId);
}

function showFetchedBreeds() {
    fetchBreeds()
        .then(breeds => {
            select.insertAdjacentHTML(
                'beforeend',
                createMarkup(breeds.data)
            );

            new SlimSelect({
                select: '#single',
                settings: {
                    placeholderText: 'Select the desired cat'
                },
            });

            loader.classList.add('is-hidden');
            select.classList.remove('is-hidden');
        })
        .catch(() => {
            loader.classList.add('is-hidden');
            Notify.warning('Failed to request data! Choose another breed.');
        });
}

function showFetchedCatBreed(selectedId) {
    fetchCatByBreed(selectedId)
        .then(cat => {
            loader.classList.add('is-hidden');
            catsInfo.classList.remove('is-hidden');
            catsInfo.innerHTML = createCatMarkup(cat.data[0]);
        })
        .catch(() => {
            catsInfo.classList.add('is-hidden');
            Notify.warning('Failed to request data! Choose another breed.');
        });
}

function createCatMarkup({ breeds, url }) {
    const { name, description, temperament } = breeds[0];
    return `
      <img src="${url}" alt="${name}" height="300" class="cat-img">
      <h2 class="cat-name">${name}</h2>
      <p class="cat-description"><span>Description:</span> ${description}</p>
      <p class="cat-temperament"><span>Temperament:</span> ${temperament}</p>
  `;
}

function createMarkup(breeds) {
    return (`<option data-placeholder="true"></option>` +
        breeds.map(breed => createOptionMarkup(breed)).join(''));
}

function createOptionMarkup({ id, name }) {
    return `<option value="${id}">${name}</option>`;
}
