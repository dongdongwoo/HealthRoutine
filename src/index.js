// css
require('./css/index.css');
require('./css/healthRegister.css');
require('./css/healthStart.css');

// router
const {
  initialRoutes,
  historyRouterPush,
} = require('./router')

//id생성에 씌일 hashCode 작성
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
const registerModules = require("./modules/healthRegister");
const startModules = require("./modules/healthStart");

const contentDiv = document.querySelector('#content-app');
// Browser History
initialRoutes('history', contentDiv);

let selectRoutineDiv = document.createElement("div");
let selectHealthDiv = document.createElement('div');
let isRoutineCreate = false;
let isRoutineModify = false;
let isHealthCreate = false;
let isHealthModify = false;
let routineConnectHealthJson = {};
let currentSelectRoutine = "";
let preModifyRoutineName = "";
let preModifyHealthKey = "";
let totalRoutineList= [];
let totalHealthList = [];
let healthListIndex = 0;
let healthSetIndex = 1;
let totalTimeCount = 0;
let currentStartSecond = 0;
let currentStartSet = 1;
let useStartCount = 0;
let startHealthInfo = {};
let isPause = false;

const initSettint = () =>{
  healthListIndex = 0;
  healthSetIndex=1;
  totalTimeCount=0;
  totalHealthList=[];
  currentStartSecond=0;
  currentStartSecond=1;
}

//click 이벤트를 호출하는 곳
contentDiv.addEventListener("click",(e)=>{
  const id = e.target.id;

  if(e.target.className==="newRoutineModifyButton"){
    isRoutineModify = true;
    selectRoutineDiv = registerModules.modifRoutineBtnClick(e.path[2]);
    preModifyRoutineName = selectRoutineDiv.children[0].textContent.hashCode();
  }else if(e.target.className==="newRoutineDeleteButton"){
    routineConnectHealthJson = registerModules.deleteRoutineBtnClick(e.path[2],e.path[3],routineConnectHealthJson);
  }else if(e.target.className==="newRoutineValue" ){
    selectRoutineDiv = registerModules.selectRoutineEvent(e.path[1],selectRoutineDiv,routineConnectHealthJson);
    currentSelectRoutine = selectRoutineDiv.children[0].textContent.hashCode();
  }else if(e.target.className === "newRoutineDiv"){
    selectRoutineDiv = registerModules.selectRoutineEvent(e.path[0],selectRoutineDiv,routineConnectHealthJson);
    currentSelectRoutine = selectRoutineDiv.children[0].textContent.hashCode();
  }else if(e.target.className === "newHealthModifyButton"){
    isHealthModify = true;
    selectHealthDiv = registerModules.modifyHealthBtnClick(e.path[2]);
    const splitValue = selectHealthDiv.children[1].textContent.split(" ");
    console.log(selectHealthDiv);
    preModifyHealthKey = splitValue[0].hashCode()+"-"+splitValue[1].split("초")[0].hashCode()+"-"+splitValue[2].split("세트")[0].hashCode();
    console.log(preModifyHealthKey);
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
    currentStartSecond = 1;
    healthSetIndex = startHealthInfo[0].set;
    historyRouterPush("/healthStart",contentDiv);
    startModules.initHealtStart(totalHealthList);
    Timer();
  }else if(id==="completeHealthButton"){//운동 완료 버튼 클릭
    isPause=false;
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
      console.log(routineConnectHealthJson);
      isHealthCreate = false;
    }else if(isHealthModify){
      routineConnectHealthJson = registerModules.modifyHealthInputEvent(preModifyHealthKey,routineConnectHealthJson,currentSelectRoutine,selectHealthDiv);
      console.log(routineConnectHealthJson);
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
    isPause=true;
    initSettint();
    historyRouterPush("/healthRegister",contentDiv);
    registerModules.initRoutineList(totalRoutineList);
  }
})

/*key board 클릭 이벤트 */
contentDiv.addEventListener("keyup", (e) => {
  if(e.keyCode===13){
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
      console.log(routineConnectHealthJson);
      isHealthCreate = false;
    }
    if(isHealthModify){
      routineConnectHealthJson = registerModules.modifyHealthInputEvent(preModifyHealthKey,routineConnectHealthJson,currentSelectRoutine,selectHealthDiv);
      console.log(routineConnectHealthJson);
      isHealthModify = false;
    }

  }else if(e.keyCode === 	27){
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
  const header = document.getElementsByClassName("header");
  const startUpToolbar = document.getElementsByClassName("startUpToolbar");
  const compeleteButton = document.querySelector("#completeButton");

  var countdown = setInterval(function() {
    if(isPause)clearInterval(countdown);
    useStartCount++;
    header[0].children[0].textContent = `${selectRoutineDiv.children[0].textContent}: ${startHealthInfo[healthListIndex].name} ${currentStartSecond}초 / ${startHealthInfo[healthListIndex].second}초 ${currentStartSet}세트 진행 중`;
    startUpToolbar[0].children[0].textContent = `${parseInt(useStartCount/60)}분:${parseInt(useStartCount%60)}초 / ${parseInt(totalTimeCount/60)}분:${parseInt(totalTimeCount%60)}초`
    if (currentStartSecond < startHealthInfo[healthListIndex].second) {
      currentStartSecond++;
    }else{
      if(currentStartSet === healthSetIndex){
        if(healthListIndex===totalHealthList.length-1){
          compeleteButton.disabled = false;
          clearInterval(countdown);
        }else{
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