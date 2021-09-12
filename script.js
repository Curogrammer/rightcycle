const searchBar_main = document.getElementById('search_main');
const optionsBtn = document.getElementById('options');
const banner = document.getElementById('banner-text');
const bannerText = document.getElementById('banner-txt');
const camModeBtn = document.getElementById('mode-cam');
const imgModeBtn = document.getElementById('mode-img');
const fileInput = document.getElementById('aifileinput');
const aiImage = document.getElementById('aiimg');
const aiLoading = document.getElementById('ailoading');

const searchBar_search = document.getElementById('search_search');
const searchResultContainer = document.getElementById('search-result');

const name_result = document.getElementById('name_result');
const content_result = document.getElementById('text_result');
const tip_result = document.getElementById('tip_result');
const howto = document.getElementById('howto');
const tip = document.getElementById('tip');
const cannotrecycle = document.getElementById('cannotrecycle');

let histories = [{ name: 'main' }];

updateBanner();

// function appHeight() {
//    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
// }
// window.addEventListener('resize', appHeight);
// appHeight();

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
  // We execute the same script as before
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

window.addEventListener('popstate', () => {
   back();
   histories = JSON.parse(Cookies.get('history'));
   const lastPage = histories[histories.length - 1];
   if (lastPage.name == 'search') {
      changePage('search');
      searchBar_search.value = lastPage.query;
   } else {
      changePage('main');
      updateBanner();
   }
});

// window.addEventListener('beforeunload', () => {
//    history.forward();
//    back();
//    histories = Cookies.get('history');
//    localStorage.setItem('alert', 'back222')
// });

window.addEventListener('resize', () => {
   let vh = window.innerHeight * 0.01;
   document.documentElement.style.setProperty('--vh', `${vh}px`);
});

searchBar_main.addEventListener('keypress', e => {
   if (e.key == 'Enter') {
      changePage('search');
      histories.push({ name: 'search', query: searchBar_main.value });
      Cookies.set('history', JSON.stringify(histories), { sameSite:'strict' });
      searchBar_search.value = searchBar_main.value;
      filter(searchBar_main.value);
   }
});

searchBar_search.addEventListener('keypress', e => {
   if (e.key == 'Enter') {
      histories.push({ name: 'search', query: searchBar_search.value });
      Cookies.set('history', JSON.stringify(histories), { sameSite:'strict' });
      filter(searchBar_search.value);
      searchBar_search.classList.remove('hidden');
   }
});

fileInput.addEventListener('change', predictImage);

function predictImage() {
   if (!window.File || !window.FileReader || !window.FileList || !window.Blob || !fileInput.files) {
      Swal.fire({
         title: '오류!',
         text: '죄송하지만, 이 브라우저는 이 기능을 지원하지 않아요.',
         icon: 'error'
      });
   } else if (!fileInput.files[0]) {
      Swal.fire({
         title: '오류!',
         text: '이미지를 선택해 주세요.',
         icon: 'warning'
      });
   } else {
      aiLoading.classList.remove('hidden');
      aiLoading.classList.add('bg-black/30');
      const file = fileInput.files[0];
      const fr = new FileReader();
      fr.addEventListener('load', () => {
         aiImage.src = fr.result;
      });
      fr.readAsDataURL(file);
      setTimeout(async () => {
         prediction_raw = await predict();
         aiLoading.classList.remove('bg-black/30')
         aiLoading.classList.add('hidden');
         setTimeout(() => {
            showSearchResult(prediction_raw[0].index);
         }, 100);
         // prediction = [];
         // prediction_raw.forEach(elem => {
         //    console.log(elem.probability);
         //    if (parseInt(elem.probability) != 0) {
         //       prediction.push(elem);
         //    }
         // });
         // if (prediction.length == 1) {
         //    showSearchResult(prediction[0].index);
         // } else {
         //    changePage('search')
         //    searchBar_search.classList.add('hidden');
         //    historys.push({ name: 'search' });
         //    prediction.forEach(elem => {
         //       searchResultContainer.innerHTML += `
         //       <div class="flex items-center space-x-8 p-5 border rounded-lg bg-white" onclick="showSearchResult(${elem.index})">
         //          <img src="${elem.img}" class="w-[40%] rounded-xl">
         //          <div>
         //             <span class="text-xl font-bold">${elem.name}</span>
         //          </div>
         //       </div>
         //       `;
         //    });
         // }
      }, 1300);
   }
}

function filter(query) {
   const q = query.replace(/\s/g, '').toLowerCase();
   const searchResults = [];
   let i = 0;
   data.forEach(elem => {
      const tags = [];
      elem.tags.forEach(tag => {
         tags.push(tag.replace(/\s/g, '').toLowerCase());
      });
      if (elem.name.replace(/\s/g, '').toLowerCase().includes(q) || tags.includes(q)) {
         elem.index = i;
         searchResults.push(elem);
      }
      i++;
   });
   searchResultContainer.innerHTML = '';
   console.log(searchResults)
   if (searchResults.length == 1) {
      showSearchResult(searchResults[0].index);
      histories.pop();
      Cookies.set('history', JSON.stringify(histories), { sameSite:'strict' });
   } else if (searchResults.length > 0) {
      searchResults.forEach(elem => {
         searchResultContainer.innerHTML += `
         <div class="flex items-center space-x-8 p-5 border rounded-lg bg-white" onclick="showSearchResult(${elem.index})">
            <img src="${elem.img}" class="w-[40%] rounded-xl">
            <div>
               <span class="text-xl font-bold">${elem.name}</span>
            </div>
         </div>
         `;
      });
   } else {
      searchResultContainer.innerHTML = `
      <div class="flex flex-col items-center space-y-5 flex-grow justify-center">
         <i class="far fa-sad-tear text-[10rem]"></i>
         <span class="text-[#808080]">검색결과가 없어요.</span>
      </div>
      `;
   }
}

function showSearchResult(index) {
   changePage('result');
   histories.push({ name: 'result' });
   Cookies.set('history', JSON.stringify(histories), { sameSite:'strict' });
   name_result.innerHTML = data[index].name;
   image_result.src = data[index].img;
   image_result.alt = data[index].name;
   if (data[index].content != 'cannot') {
      content_result.innerHTML = data[index].content;
      tip_result.innerHTML = '';
      data[index].tips.forEach(tip => {
         tip_result.innerHTML += `<li>${tip}</li>`;
      });
      cannotrecycle.classList.add('hidden');
      howto.classList.remove('hidden');
   } else {
      howto.classList.add('hidden');
      cannotrecycle.classList.remove('hidden');
   }
}

function back() {
   histories.pop();
   Cookies.set('history', JSON.stringify(histories), { sameSite:'strict' });
   const lastPage = histories[histories.length - 1];
   if (lastPage.name == 'search') {
      changePage('search');
      searchBar_search.value = lastPage.query;
   } else {
      changePage('main');
      updateBanner();
   }
}

function updateBanner() {
   banner.innerHTML = banners[getRandomInt(0, banners.length)]
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

