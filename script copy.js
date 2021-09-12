const searchBar = document.getElementById('search');
const optionsBtn = document.getElementById('options');
const banner = document.getElementById('banner');
const bannerText = document.getElementById('banner-txt');
const camModeBtn = document.getElementById('mode-cam');
const imgModeBtn = document.getElementById('mode-img');
const startBtn = document.getElementById('start');

const result_searchBar = document.getElementById('result-search');
const searchResultContainer = document.getElementById('search-result');

searchBar.addEventListener('keypress', e => {
   if (e.key == 'Enter') {
      changePage('search');
      result_searchBar.value = searchBar.value;
      filter(searchBar.value);
   }
});

result_searchBar.addEventListener('keypress', () => {
   searchBar.value = result_searchBar.value;
   filter(result_searchBar.value);
});

function filter(query) {
   const q = query.replace(/\s/g, '');
   const searchResults = [];
   let i = 0;
   data.forEach(elem => {
      const tags = [];
      elem.tags.forEach(tag => {
         tags.push(tag.replace(/\s/g, ''));
      });
      if (elem.name.replace(/\s/g, '').includes(q) || tags.includes(q)) {
         elem.index = i;
         searchResults.push(elem);
      }
      i++;
   });
   searchResultContainer.innerHTML = '';
   if (searchResults.length == 1) {
      showResult(searchResults[0].index);
   } else if (searchResults.length > 0) {
      searchResults.forEach(elem => {
         /* html */
         searchResultContainer.innerHTML += `
         <div class="flex items-center space-x-5 p-5 border rounded-lg bg-white" onclick="showResult(${elem.index})">
            <img src="img/${elem.img}" class="w-[40vw]">
            <div>
               <span class="text-xl">${elem.name}</span>
            </div>
         </div>
         `;
      });
   } else {
      /* html */
      searchResultContainer.innerHTML += `
      <div class="flex flex-col items-center space-y-5 flex-grow justify-center">
         <i class="w-[100px] h-[100px]" data-feather="frown"></i>
         <span class="text-[#808080]">검색결과가 없어요.</span>
      </div>
      `;
      feather.replace();
   }
}

[camModeBtn, imgModeBtn].forEach(elem => {
   elem.addEventListener('click', () => {
      [camModeBtn, imgModeBtn].forEach(elem_ => {
         elem_.classList.remove('bg-light','rounded-xl', 'border', 'border-primary');
      });
      elem.classList.add('bg-light', 'rounded-xl', 'border', 'border-primary');
   });
});

function showResult(index) {
   changePage('result');
}
