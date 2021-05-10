// css
require('./css/index.css');
require('./css/healthRegister.css');
require('./css/healthStart.css');

// router
const {
  initialRoutes,
  historyRouterPush,
} = require('./router')

//미리 정의한 모듈 import
const registerModules = require("./modules/healthRegister");
const startModules = require("./modules/healthStart");

const contentDiv = document.querySelector('#content-app');
// Browser History
initialRoutes('history', contentDiv);

// app division
const addRoutineButton = contentDiv.getElementsByClassName("addRoutineButton");

//click 이벤트를 호출하는 곳
contentDiv.addEventListener("click",(e)=>{
  const id = e.target.id;
  
  if(id==="startHealthButton"){
    historyRouterPush("/healthStart",contentDiv);
  }else if(id==="completeHealthButton"){
    historyRouterPush("/healthRegister",contentDiv);
  }else if(id==="addRoutineButton"){

  }
  else if(id==="addHealthButton"){
    
  }
  else if(id==="deleteHealthButton"){
    
  }
  else if(id==="saveHealthButton"){
    
  }
  else if(id==="cancelHealthButton"){
    
  }
  else if(id==="pauseHealthButton"){
    
  }
  else if(id==="restartHealthButton"){
    
  }
})

addRoutineButton[0].addEventListener("click",(e)=>{
  registerModules.addRoutineBtnClick();
})

/*key board 클릭 이벤트 */
contentDiv.addEventListener("keyup", (e) => {
  const id = e.target.id;
  
});

/* 남은시간 계산 */
var Timer = () =>{
  var countdown = setInterval(function() {
    
  }, 1000);
  return () => clearInterval(countdown);
}