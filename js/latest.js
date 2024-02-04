/// 최근검색어 로컬저장소에 저장해서 보여주기.
// 초기값 설정
/* window.onload = function() {
  // Local Storage에서 'searchKeyword' 키에 저장된 데이터를 가져옴
  let initialKeywords = localStorage.getItem('searchKeyword');

  // 데이터가 없으면 초기값으로 설정할 키워드 배열을 생성
  if (!initialKeywords) {
      initialKeywords = ["flex", "text", "col-", "-lg"];
      // 초기값을 JSON 문자열로 변환하여 'searchKeyword' 키에 저장
      localStorage.setItem('searchKeyword', JSON.stringify(initialKeywords));
  }
}; */

function saveKeyword() {
// input 필드에서 텍스트를 가져옴
const inputText = document.getElementById('classSearch').value.trim();

// 입력값이 빈 문자열인 경우 함수를 종료
if (inputText === "") {
    console.log("Empty search keyword. Not saving.");
    return;
}

// Local Storage에서 기존에 저장된 배열을 가져옴
let searches = localStorage.getItem('searchKeyword');

// 배열이 없으면 새 배열을 만들고, 있으면 JSON 문자열을 배열로 변환
searches = searches ? JSON.parse(searches) : [];


// 배열에 입력값이 이미 존재하는지 확인
if (searches.includes(inputText)) {
    console.log("Duplicate search keyword. Not saving.");
    return;
}

// 새 입력값을 배열에 추가
searches.push(inputText);

// 배열을 JSON 문자열로 변환하여 Local Storage에 다시 저장
localStorage.setItem('searchKeyword', JSON.stringify(searches));
console.log("Saved searches:", searches);
};


function showKeyword() {
// Local Storage에서 'inputTexts' 키에 저장된 데이터를 가져옴
let searches = localStorage.getItem('searchKeyword');

// 데이터가 있으면 JSON 문자열을 배열로 변환, 없으면 빈 배열을 할당
searches = searches ? JSON.parse(searches) : [];


// 콘솔에 배열 출력
console.log(searches, typeof searches, Array.isArray(searches)); // 로컬저장소에 저장된 검색어 확인 
}

function deleteKeyword() {
// Local Storage에서 'inputTexts' 키에 저장된 데이터를 가져옴
let searches = localStorage.getItem('searchKeyword');
// 데이터가 있으면 JSON 문자열을 배열로 변환, 없으면 빈 배열을 할당
searches = searches ? JSON.parse(searches) : [];


localStorage.removeItem('searchKeyword');

// 콘솔에 배열 출력
console.log("All data clear"); // 로컬저장소에 저장된 검색어 확인 
document.querySelector("#latest").innerHTML = "";
}


/// 로컬저장소에 저장된 배열로 최근검색어 생성
function makeLatest() {
  let searches = localStorage.getItem('searchKeyword');
  searches = searches ? JSON.parse(searches) : [];

  const maxDisplayedItems = 5; // 최대 표시할 항목 수

  // 최근 5개 항목만 추출
  const latestSearches = searches.slice(-maxDisplayedItems);

  let latestbtn = "";
  latestSearches.map((el, idx) => {
    latestbtn += `<button onclick="setSearchValue('${el}');" class="latestbtn btn btn-primary m-0 ml-2 px-1 py-0">
      ${el}
      
    </button>
    <button class="deleteKeyword bi bi-x-lg btn btn-primary m-0 px-1 py-0" onclick="deleteLatest(${idx})"></button>`
  });

  document.querySelector("#latest").innerHTML = latestbtn;

  // 5개 초과시 모든 검색어 표시 버튼 추가
  /* if (searches.length > maxDisplayedItems) {
    document.querySelector("#latest").innerHTML += `
      <button onclick="showAllSearches()" class="btn btn-primary mx-2 py-0">Show More</button>
    `;
  } */
  // 5개 초과시 검색어 전부 삭제 버튼추가
  if (searches.length > maxDisplayedItems) {
    document.querySelector("#latest").innerHTML += `
    <button class="btn btn-danger m-2 px-1 py-0" onclick="deleteKeyword()">Clear All</button>
    `;
  }
}

// Show More 버튼 클릭 시 모든 검색어 표시 -> 
/* function showAllSearches() {
  let searches = localStorage.getItem('searchKeyword');
  searches = searches ? JSON.parse(searches) : [];

  let latestbtn = "";
  searches.map((el, idx) => {
    latestbtn += `<button onclick="setSearchValue('${el}');" class="latestbtn btn btn-primary mx-2 py-0">
      ${el}
      <span class="deleteKeyword" onclick="deleteLatest(${idx})">X</span>
    </button>`
  });

  document.querySelector("#latest2").innerHTML = latestbtn;
} */

makeLatest(); // 페이지시작시 1회 실행.

// #classSearch 값 설정 함수
function setSearchValue(value) {
  document.getElementById('classSearch').value = value;
  searchClass(); // 검색 실행 (필요한 경우)
}

// Enter 키 이벤트 감지 함수
document.getElementById('classSearch').addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
      document.getElementById('classSearchBtn').click(); // 버튼 클릭
  }
});


// 최근 검색어 삭제 함수
function deleteLatest(index) {
  let searches = localStorage.getItem('searchKeyword');
  searches = searches ? JSON.parse(searches) : [];

  // 해당 인덱스의 검색어를 배열에서 제거
  if (index >= 0 && index < searches.length) {
    const deletedKeyword = searches.splice(index, 1)[0]; // 삭제된 검색어를 저장
    localStorage.setItem('searchKeyword', JSON.stringify(searches)); // 업데이트된 배열을 다시 저장
    makeLatest(); // 최근 검색어 목록 업데이트
    console.log(`Deleted keyword: ${deletedKeyword}`);
  }
}