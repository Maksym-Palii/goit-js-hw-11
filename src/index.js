import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { FetchImg } from './js/fetchImg';
import { LoadMoreBtn } from './js/loadMoreBtn';

const formtEl = document.querySelector('.search__form');
const galleryEl = document.querySelector('.gallery');
// const showMoreBtnEl = document.querySelector('.add-search__btn');

const fetchImg = new FetchImg();
const showMoreBtnEl = new LoadMoreBtn({
  selector: '#load-more',
  isHidden: true,
});

formtEl.addEventListener('submit', onSubmit);
showMoreBtnEl.button.addEventListener('click', onMoreSearch);

function onSubmit(evt) {
  evt.preventDefault();
  // if (fetchImg.search === '') {
  //   Notify.failure('Please enter your details');
  // }

  const form = evt.currentTarget;
  fetchImg.search = form.elements.searchQuery.value.trim();
  clearImgList();
  fetchImg.resetPage();
  showMoreBtnEl.show();

  console.log(fetchImg.search);

  fetchImgCard().finally(() => form.reset());
  fetchImg.info();
}

function onMoreSearch() {
  fetchImgCard();
}

async function fetchImgCard() {
  showMoreBtnEl.disable();
  try {
    const data = await fetchImg.getImg();
    if (!data.totalHits) throw new Error();

    if (!(fetchImg.queryPage > 2)) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    let currentPage = +fetchImg.queryPage * 40;
    console.log(currentPage);
    let totalImg = data.totalHits;
    console.log(totalImg);

    if (totalImg <= currentPage) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      showMoreBtnEl.hide();
    }

    const hits = await data.hits;
    const listImg = await createMurkup(hits);
    const murkupList = await updateImgList(listImg);
    showMoreBtnEl.enable();
    return murkupList;
  } catch (error) {
    onError();
    console.log(error.message);
  }

  // countHits += data.hits.length;
  //   if (countHits === data.totalHits) {
  //     showMoreBtnEl.hide();
  //     return Notify.info(
  //       "We're sorry, but you've reached the end of search results."
  //     );
  //   }
}

// function fetchImg() {
//   return getImg(searchInfo)
//     .then(data => createMurkup(data))
//     .then(updateNewsList);
// }

function createMurkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
    <div class="photo-card">
  <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item"><b>Likes</b> ${likes}</p>
    <p class="info-item"><b>Views</b> ${views}</p>
    <p class="info-item"><b>Comments</b> ${comments}</p>
    <p class="info-item"><b>Downloads</b> ${downloads}</p>
  </div>
</div>`
    )
    .join('');
  return markup;
}

function updateImgList(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function clearImgList() {
  galleryEl.innerHTML = '';
}

function onError() {
  clearImgList();
  Notify.failure('Please enter your details');
}
