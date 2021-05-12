// css
require('./css/index.css');
require('./css/healthRegister.css');
require('./css/healthStart.css');

// router
const {
  initialRoutes,
  historyRouterPush,
} = require('./router')

//id생성에 쓰일 hashCode 작성
String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

//미리 정의한 모듈 import
const registerModules = require("./modules/healthRegister"); //운동 등록 화면에 쓰일 함수 모듈
const startModules = require("./modules/healthStart"); // 운동 실행 화면에 쓰일 함수 모듈

const contentDiv = document.querySelector('#content-app');

// Browser History
initialRoutes('history', contentDiv);

let selectRoutineDiv = document.createElement("div"); //선택된 운동 루틴 변수
let selectHealthDiv = document.createElement('div'); //선택된 운동 항목 변수
let isRoutineCreate = false; //입력시 현재 루틴 생성인지 체크하는 변수
let isRoutineModify = false; //입력이 현재 루틴 수정인지 체크하는 변수
let isHealthCreate = false; //입력시 현재 운동 항목 생성인지 체크하는 변수
let isHealthModify = false; //입력시 현재 운동 항목 수정인지 체크하는 변수
let routineConnectHealthJson = {}; //운동 루틴과 항목 리스트를 연결시켜주는 json (매핑)
let currentSelectRoutine = ""; //현재 선택된 운동 루틴의 값
let preModifyRoutineName = ""; //다른 운동 루틴 선택시 이전의 선택된 운동 루틴의 값
let preModifyHealthKey = ""; //이전에 선택된 운동 항목의 값
let totalRoutineList= []; //전체 운동 루틴 name 배열 => 운동 완료 및 멈추기 버튼 클릭시 운동 등록 화면으로 돌아올때 필요
let totalHealthList = []; //선택된 운동 루틴의 운동 항목 배열
let healthListIndex = 0; //현재 운동 실행중인 운동 항목 리스트 인덱스
let healthSetIndex = 1; //현재 운동 실행중인 운동 항목의 총 set수
let totalTimeCount = 0; //해당 운동 루틴에 추가된 총 운동 항목들의 시간
let currentStartSecond = 0; //현재 운동 실행중인 운동의 시간
let currentStartSet = 1; //현재 운동 실행중인 운동의 세트 수
let useStartCount = 0; //운동 시작후 총 걸리는 운동 시간
let startHealthInfo = {};//현재 운동 실행중인 항목의 시간, 세트수, 이름을 저장하는 json
let isPause = false;//운동을 일시정지하는지 재시작할시 사용되는 변수

const initSettint = () =>{ //운동 완료, 멈추기 클릭시 현재까지 사용했던 변수들 init
  healthListIndex = 0;
  healthSetIndex=1;
  totalTimeCount=0;
  totalHealthList=[];
  currentStartSecond=1;
  currentStartSet=1;
  useStartCount=0;
}

//click 이벤트를 호출하는 곳
contentDiv.addEventListener("click",(e)=>{
  const id = e.target.id;

  //동작 중에 추가되는 수정, 삭제의 경우 class명을 이용해 구분토록 한다
  if(e.target.className==="newRoutineModifyButton"){//운동 루틴 수정 버튼 클릭 이벤트
    isRoutineModify = true;
    selectRoutineDiv = registerModules.modifRoutineBtnClick(e.path[2]);
    preModifyRoutineName = selectRoutineDiv.children[0].textContent.hashCode();
  }else if(e.target.className==="newRoutineDeleteButton"){//운동 루틴 삭제 버튼 클릭 이벤트
    routineConnectHealthJson = registerModules.deleteRoutineBtnClick(e.path[2],e.path[3],routineConnectHealthJson);
  }else if(e.target.className==="newRoutineValue" ){//운동 루틴 text 클릭 이벤트 => select 루틴
    selectRoutineDiv = registerModules.selectRoutineEvent(e.path[1],selectRoutineDiv,routineConnectHealthJson);
    currentSelectRoutine = selectRoutineDiv.children[0].textContent.hashCode();
  }else if(e.target.className === "newRoutineDiv"){//운동 루틴 div 클릭 이벤트 => select 루틴
    selectRoutineDiv = registerModules.selectRoutineEvent(e.path[0],selectRoutineDiv,routineConnectHealthJson);
    currentSelectRoutine = selectRoutineDiv.children[0].textContent.hashCode();
  }else if(e.target.className === "newHealthModifyButton"){ //운동 항목 수정 버튼 이벤트
    isHealthModify = true;
    selectHealthDiv = registerModules.modifyHealthBtnClick(e.path[2]);
    const splitValue = selectHealthDiv.children[1].textContent.split(" ");
    preModifyHealthKey = splitValue[0].hashCode()+"-"+splitValue[1].split("초")[0].hashCode()+"-"+splitValue[2].split("세트")[0].hashCode();
  }

  if(id==="startHealthButton"){//운동 시작 버튼 클릭
    const routineListDiv = document.querySelector("#routineListDiv");
    const healthListDiv = document.querySelector("#healthListDiv");

    totalRoutineList=[];
    for(let i=0;i<routineListDiv.children.length;i++)totalRoutineList.push(routineListDiv.children[i].children[0].textContent);
    totalHealthList = registerModules.startHealthButton(totalHealthList);

    for(let i=0;i<healthListDiv.children.length;i++){
      const splitValue = healthListDiv.children[i].children[1].textContent.split(" ");
      const secondPerSet = parseInt(splitValue[1].split("초")[0]);
      const setNumber = parseInt(splitValue[2].split("세트")[0]);
      totalTimeCount+=parseInt(secondPerSet)*parseInt(setNumber);
      let healthInfoJson = {};
      healthInfoJson.name = splitValue[0];
      healthInfoJson.second = secondPerSet;
      healthInfoJson.set = setNumber;

      startHealthInfo[i] = healthInfoJson;
    }
    useStartCount=0;
    currentStartSecond=1;
    healthSetIndex = startHealthInfo[0].set;
    historyRouterPush("/healthStart",contentDiv);
    startModules.initHealtStart(totalHealthList);
    isPause = false;
    Timer();
  }else if(id==="completeHealthButton"){//운동 완료 버튼 클릭
    isPause = true;
    initSettint();
    historyRouterPush("/healthRegister",contentDiv);
    registerModules.initRoutineList(totalRoutineList);
  }else if(id==="addRoutineButton"){ //루틴 생성 버튼 클릭
    isRoutineCreate = true;
    registerModules.addRoutineBtnClick();
  }
  else if(id==="addHealthButton"){ //운동 생성 버튼 클릭
    isHealthCreate = true;
    registerModules.addHealthBtnClick();
  }
  else if(id==="deleteHealthButton"){//운동 삭제 버튼 클릭
    routineConnectHealthJson = registerModules.deleteHealthBtnClick(currentSelectRoutine,routineConnectHealthJson);
  }
  else if(id==="saveHealthButton"){//운동 저장 버튼 클릭
    if(isHealthCreate){
      routineConnectHealthJson = registerModules.addHealthInputEvent(routineConnectHealthJson,currentSelectRoutine);
      isHealthCreate = false;
    }else if(isHealthModify){
      routineConnectHealthJson = registerModules.modifyHealthInputEvent(preModifyHealthKey,routineConnectHealthJson,currentSelectRoutine,selectHealthDiv);
      isHealthModify = false;
    }
  }
  else if(id==="cancelHealthButton"){//운동 생성 및 수정 취소 버튼 클릭
    registerModules.cancelHealthInputEvent();
  }
  else if(id==="pauseHealthButton"){//운동 일시정지 버튼 클릭
    isPause=true;
  }
  else if(id==="restartHealthButton"){//운동 재시작 버튼 클릭
    isPause=false;
    Timer();
  }else if(id==="stopHealthButton"){//운동 멈추기 버튼 클릭
    isPause = true;
    initSettint();
    historyRouterPush("/healthRegister",contentDiv);
    registerModules.initRoutineList(totalRoutineList);
  }
})

/*key board 클릭 이벤트 */
contentDiv.addEventListener("keyup", (e) => {
  if(e.keyCode===13){//엔터 key 입력시
    if(isRoutineCreate){
      routineConnectHealthJson = registerModules.addRoutineInputEvent(routineConnectHealthJson);
      isRoutineCreate = false;
    }
    if(isRoutineModify){
      routineConnectHealthJson = registerModules.modifyRoutineInputEvent(preModifyRoutineName,routineConnectHealthJson,selectRoutineDiv);
      isRoutineModify = false;
    }
    if(isHealthCreate){
      routineConnectHealthJson = registerModules.addHealthInputEvent(routineConnectHealthJson,currentSelectRoutine);
      isHealthCreate = false;
    }
    if(isHealthModify){
      routineConnectHealthJson = registerModules.modifyHealthInputEvent(preModifyHealthKey,routineConnectHealthJson,currentSelectRoutine,selectHealthDiv);
      isHealthModify = false;
    }

  }else if(e.keyCode === 	27){//esc key 입력시
    if(isRoutineCreate || isRoutineModify){
      registerModules.cancelRoutineInputEvent();
      isRoutineCreate = false;
      isRoutineModify = false;
    }
    if(isHealthCreate || isHealthModify){
      registerModules.cancelHealthInputEvent();
      isHealthCreate = false;
      isHealthModify = false;
    }
  }
});

/* 남은시간 계산 */
var Timer = () =>{
  const header = document.getElementsByClassName("startHeader");
  const startUpToolbar = document.getElementsByClassName("startUpToolbar");
  const compeleteButton = document.querySelector("#completeHealthButton");

  var countdown = setInterval(function() {
    if(isPause)clearInterval(countdown);
    useStartCount++;
    header[0].children[0].textContent = `${selectRoutineDiv.children[0].textContent}: ${startHealthInfo[healthListIndex].name} ${currentStartSecond}초 / ${startHealthInfo[healthListIndex].second}초 ${currentStartSet}세트 진행 중`;
    startUpToolbar[0].children[0].textContent = `${parseInt(useStartCount/60)}분:${parseInt(useStartCount%60)}초 / ${parseInt(totalTimeCount/60)}분:${parseInt(totalTimeCount%60)}초`
    if (currentStartSecond < startHealthInfo[healthListIndex].second) { //현재 실행중인 운동 항목의 시간보다 작으면 count++
      currentStartSecond++;
    }else{
      if(currentStartSet === healthSetIndex){//set를 모두 채우면
        if(healthListIndex===totalHealthList.length-1){//마지막 운동 항목인지를 체크 만약 마지막 항목운동이였다면 타이머 종료
          compeleteButton.disabled = false;
          clearInterval(countdown);
        }else{//마지막 운동 항목이 아니라면 다음 운동 항목으로 넘어가고 background 변경
          const preStartHealthDiv = document.getElementsByClassName(`startHealthDiv_${healthListIndex}`);
          preStartHealthDiv[0].style.backgroundColor = "white";
          healthListIndex++;
          const currentStartHealthDiv = document.getElementsByClassName(`startHealthDiv_${healthListIndex}`);
          currentStartHealthDiv[0].style.backgroundColor = "gray"; 

          currentStartSet=1;
          healthSetIndex=startHealthInfo[healthListIndex].set;
        }
      }
      else{
        currentStartSet++;
      }
      currentStartSecond=1;
    }
  }, 1000);
  return () => clearInterval(countdown);
}