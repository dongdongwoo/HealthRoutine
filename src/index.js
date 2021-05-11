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
    historyRouterPush("/healthStart",contentDiv);
  }else if(id==="completeHealthButton"){//운동 완료 버튼 클릭
    historyRouterPush("/healthRegister",contentDiv);
  }else if(id==="addRoutineButton"){ //루틴 생성 버튼 클릭
    isRoutineCreate = true;
    registerModules.addRoutineBtnClick();
  }
  else if(id==="addHealthButton"){ //운동 생성 버튼 클릭
    isHealthCreate = true;
    registerModules.addHealthBtnClick();
  }
  else if(id==="deleteHealthButton"){//운동 삭제 버튼 클릭
    registerModules.deleteHealthBtnClick(selectRoutineDiv);
  }
  else if(id==="saveHealthButton"){//운동 저장 버튼 클릭
    registerModules.addHealthBtnClick();
  }
  else if(id==="cancelHealthButton"){//운동 생성 및 수정 취소 버튼 클릭
    registerModules.cancelHealthInputEvent();
  }
  else if(id==="pauseHealthButton"){//운동 일시정지 버튼 클릭
    startModules.pauseBtnClick();
  }
  else if(id==="restartHealthButton"){//운동 재시작 버튼 클릭
    startModules.restartBtnClick();
  }else if(id==="stopHealthButton"){//운동 멈추기 버튼 클릭
    historyRouterPush("/healthRegister",contentDiv);
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
  var countdown = setInterval(function() {
    
  }, 1000);
  return () => clearInterval(countdown);
}