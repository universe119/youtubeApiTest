// // 서버에서 "실시간으로" 외부 데이터를 내 웹 페이지 문서로 가져오는 방법
// fetch("요청URL").then(data=>data.json()).then(json=>{
//   // 요청한 서버쪽으로부터 성공적으로 데이터를 전달받으면 json이라는 매개변수 데이터 확인 가능
//   console.log(json);
// })

// QueryString : 기본 요청 URL뒤에 문자열형태로 옵션값을 달아서 서버에 요청하는 형태 https://www.abc.com?pwd=1234&name=abc;
// www.abc.com // 기본 요청 URL
// ?뒤에 있는 key=value 값 문자열 형태로 지정한 추가 요청사항, 요청사항이 여러개 일때에는 &로 구분
// console.log("youtube");

const api_key = "AIzaSyC0YTkwnKAxe7Th6bkOdlmS5uW4auLXs8s";
const pid = "PLbavOBDiF2ET3lP5KfSAKyfAH-8oVGPQm";
const num = 10;

const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${pid}&key=${api_key}&maxResults=${num}`;

const frame = document.querySelector("section");

// 유튜브 데이터를 가져와서 동적으로 리스트 출력
fetch(url)
	.then((data) => data.json())
	.then((json) => {
		// console.log(json);
		const vidsData = json.items;
		let tags = "";

		vidsData.forEach((data) => {
			let title =
				data.snippet.title.length > 60
					? data.snippet.title.substring(0, 60) + "..."
					: data.snippet.title;

			let desc =
				data.snippet.description.length > 120
					? data.snippet.description.substring(0, 120) + "..."
					: data.snippet.description;

			let date = data.snippet.publishedAt.split("T")[0].split("-").join(".");

			tags += `
      <article>
        <h2>${title}</h2>

        <div class="txt">
          <p>${desc}</p>
          <span>${date}</span>
        </div>
        
        <div class="pic">
          <img src="${data.snippet.thumbnails.standard.url}" alt="${data.snippet.title}">
        </div>
      </article>
      `;
		});
		console.log(tags);
		frame.innerHTML = tags;
	});

// 위쪽의 fetch구문의 아래쪽의 동적으로 생성한 DOM요소를 변수 담는 구문은 동시에 실행됨
// 비동기적으로 동작함
// 코드의 작성순서대로 동작하는게 아니라 동시다발적으로 실행되기 때문에
// 코드흐름의 어그러지는 현상

// 위에 처럼 비동기적으로 발생하는 코드의 흐름을 강제적으로 동기적 처리
// 코드 작성순서대로 순차적으로 실행되게 만드는 작업(동기화)
const titles = document.querySelector("article h2");
console.log(titles); // null값
