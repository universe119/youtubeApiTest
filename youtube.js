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
			// console.log(data);
			// console.log(data.snippet.resourceId.videoId);
			let title =
				data.snippet.title.length > 60
					? data.snippet.title.substring(0, 60) + "..."
					: data.snippet.title;

			let desc =
				data.snippet.description.length > 120
					? data.snippet.description.substring(0, 120) + "..."
					: data.snippet.description;

			let date = data.snippet.publishedAt.split("T")[0].split("-").join(".");

			//h2요소에 data-id라는 커스텀 속성을 만들어서 유튜브 영상 id값 숨겨놓음.
			tags += `
      <article>
        <h2 class="vidTitle" data-id=${data.snippet.resourceId.videoId}>${title}</h2>

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
		// console.log(tags);
		frame.innerHTML = tags;
	});

// 위쪽의 fetch구문의 아래쪽의 동적으로 생성한 DOM요소를 변수 담는 구문은 동시에 실행됨
// 비동기적으로 동작함
// 코드의 작성순서대로 동작하는게 아니라 동시다발적으로 실행되기 때문에
// 코드흐름의 어그러지는 현상

// 위에 처럼 비동기적으로 발생하는 코드의 흐름을 강제적으로 동기적 처리
// 코드 작성순서대로 순차적으로 실행되게 만드는 작업(동기화)

//아직 fetch문의 동작이 끝나지 않아서 article의 h2요소의 생성이 완료되지 않았는데
//아직 없는 동적요소인 h2를 호출함으로써 발생하는 오류
//해결 방법 : 이벤트 위임 (Event Delegate) : 항상 있는 요소에 일단은 이벤트를 맡겨놓았다가
//동적 요소가 생성되면 그때 이벤트를 대신 전달해주는 방법

//자바스크립트를 이용해서 동적으로 생선된 요소는 일반적인 방법으로 이벤트 연결이 불가
// 동적인 요소가 만들어 지는 위치가 fetch함수의 then구문안쪽인데 그밖에서는 동적인 요소 선택 불가
// 제일 간단한 해결 방법 : 동적생성요소찾는 구문을 돔을 생성하는 코드 블록 안쪽에서 호출
// 위의 방법의 단점 : fetch함수 코드블록 안쪽에 또 다시 복잡한 이벤트 연결 로직을 작성해야 되기 떄문에 코드의 복잡도 증가
// 기능별로 코드 분리가 불가능

// 위와 같은 이유로 부득이하게 동적인 요소의 이벤트 연결을 fetch함수 밖에서 연결하는 경우가 많음
// 이벤트위임: 지금 당장은 없는 DOM요소에 이벤트를 전달하기 위해서 항상 존재하는 요소에 이벤트를 맡겨서
// 추후 동적요소가 생성완료되면 그때 이벤트를 대신 전달해주는 방식

// 이벤트위임: 항상존재하는 body요소에 일단은 이벤트를 맡겼다가 동적요소가 생성완료되면 body가 대신 이벤트 전달

//동적 생성요소에 이벤트 연결해서 동적으로 모달요소 추가
document.body.addEventListener("click", (e) => {
	// console.log(e.target);

	// body전체에 이벤트를 연결한 뒤 이벤트 발생한 실제대상을 조건문으로 분기처리해서
	// 조건에 부합될때에만 원하는 구문 연결(이처럼 번거로운작업을 처리하지 않기 위해서 리액트같은 프레임웍, 라이브러리를 사용함)

	//클릭한 대상인 h2요소에 data-id속성으로 숨겨놓은 유튜브 영상 id값을 변수에 옮겨담고
	//동적으로 생성되는 iframe요소의 src값에 연동
	const vidId = e.target.getAttribute("data-id");
	// console.dir(e.target);

	if (e.target.className === "vidTitle") {
		// console.log("you clicked VidTItle");
		// 동적으로 aside로 모달창 생성
		// 해당 모달창을 절대 innerHTML로 생성 불가
		// innerHTML은 기존의 선택자 안쪽의 요소들을 다 지우고 새로운 요소들로 바꿔치기 하는 개념
		// 지금 처럼 기존 목록요소를 모달만 추가하고자 할때는 적합하지 않음
		// 해결 방법 : 부모선택자.append(동적 생성요소:돔객체)

		// 동적 돔 객체를 메서드를 통해서 직접 생성
		const asideEl = document.createElement("aside"); // aside라는 엘리먼트 노트를 직접 생성하는것

		//aside라는 비어있는 엘리멘트요소 안쪽에 기존처럼 innerHTML원하는 요소 동적 생성.
		asideEl.innerHTML = `
      <div class="con">
        <iframe src="http://www.youtube.com/embed/${vidId}" frameborder="0"></iframe>
      </div>
      <button class="btnClose">close</button>
    `;
		//append로 기존 요소 유지하면서 aside요소 추가 (인수로는 문자가 아닌 엘리멘트 노드 필요)

		// body안쪽의 요소들을 그대로 유지하면서 동적으로 aside요소 추가
		// document.body.append(asideEl); // 기존요소 유지하면서 뒤쪽에 추가

		// 기존요소 유지하면서 앞쪽에 추가
		// document.body.prepend(asideEl);
		document.body.append(asideEl);
	}
});
//동적으로 생선된 모달 닫기 버튼에 이벤트 위임
document.body.addEventListener("click", (e) => {
	if (e.target.className === "btnClose") {
		// display=none과는 다르게 물리적으로 DOM자체를 제거
		document.querySelector("aside").remove();
	}
});
