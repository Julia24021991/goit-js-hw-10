import SlimSelect from 'slim-select';
import { fetchBreeds, fetchCatByBreed } from './cat-api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'slim-select/dist/slimselect.css';

const refs = {
    select: document.querySelector('.breed-select'),
    catsInfo: document.querySelector('.cat-info'),
    loader: document.querySelector('.loader'),
};

Notify.init({
    position: 'center-top',
    distance: '70px',
    timeout: 3000,
    cssAnimationStyle: 'zoom',
    fontFamily: 'Arial, sans-serif',
});

refs.select.classList.add('is-hidden');
refs.catsInfo.classList.add('is-hidden');

refs.select.addEventListener('change', selectChangeHandler);

showFetchedBreeds();

function selectChangeHandler(event) {
    const selectedCatIndex = event.currentTarget.selectedIndex;
    const selectedId = event.currentTarget[selectedCatIndex].value;

    refs.loader.classList.remove('is-hidden');
    refs.catsInfo.classList.add('is-hidden');
    refs.catsInfo.innerHTML = '';

    showFetchedCatBreed(selectedId);
}

function showFetchedBreeds() {
    fetchBreeds()
        .then(breeds => {
            refs.select.insertAdjacentHTML(
                'beforeend',
                createMarkup(breeds.data)
            );

            new SlimSelect({
                select: '#single',
                settings: {
                    placeholderText: 'Select the desired cat'
                },
            });

            refs.loader.classList.add('is-hidden');
            refs.select.classList.remove('is-hidden');
        })
        .catch(() => {
            refs.loader.classList.add('is-hidden');
            Notify.warning('Failed to request data! Choose another breed.');
        });
}

function showFetchedCatBreed(selectedId) {
    fetchCatByBreed(selectedId)
        .then(cat => {
            refs.loader.classList.add('is-hidden');
            refs.catsInfo.classList.remove('is-hidden');
            refs.catsInfo.innerHTML = createCatMarkup(cat.data[0]);
        })
        .catch(() => {
            refs.catsInfo.classList.add('is-hidden');
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
