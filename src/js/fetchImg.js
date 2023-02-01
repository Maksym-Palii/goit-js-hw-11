const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const URL = 'https://pixabay.com/api/';
const API_KEY = '33242507-b636b92a727f8a1118e29175e';

export class FetchImg {
  constructor() {
    this.queryPage = 1;
    this.search = '';
  }
  async getImg() {
    const options = {
      params: {
        key: API_KEY,
        q: this.search,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: '40',
        page: this.queryPage,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios.get(URL, options);
    // if (!response.status.ok) {
    //   throw new Error(response.status);
    // }

    this.incrementPage();
    // console.log(response.data);
    return response.data;
  }

  resetPage() {
    this.queryPage = 1;
  }

  incrementPage() {
    this.queryPage += 1;
  }

  info() {
    // Notify.info(
    //   `Hooray! We found ${this.fetchImg.getImg.response.data.totalHits} images.`
    // );
    // console.log(this.fetchImg);
    // console.log(this.getImg);
  }
}
