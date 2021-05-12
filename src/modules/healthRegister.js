/*운동 루틴 영역*/
const initRoutineList = (routineList) =>{
  for(let i=0;i<routineList.length;i++){
    const routineListDiv = document.querySelector("#routineListDiv");
    
    let newRoutineDiv = document.createElement("div");
    newRoutineDiv.className = "newRoutineDiv";

    let newRoutineValue = document.createElement("p");
    newRoutineValue.textContent = routineList[i];
    newRoutineValue.className = "newRoutineValue";
    let newRoutineButtonDiv = document.createElement("div");
    newRoutineButtonDiv.className = "newRoutineButtonDiv";

    let newRoutineModifyButton = document.createElement("button");
    newRoutineModifyButton.textContent = "수정";
    newRoutineModifyButton.className = "newRoutineModifyButton";
    let newRoutineDeleteButton = document.createElement("button");
    newRoutineDeleteButton.textContent = "삭제";
    newRoutineDeleteButton.className = "newRoutineDeleteButton";
    
    newRoutineButtonDiv.append(newRoutineModifyButton);
    newRoutineButtonDiv.append(newRoutineDeleteButton);

    newRoutineDiv.append(newRoutineValue);
    newRoutineDiv.append(newRoutineButtonDiv);

    routineListDiv.append(newRoutineDiv);
  }
}

const addRoutineBtnClick = () => {
  const routineInput = document.querySelector("#addRoutineInput");
  routineInput.style.display = "";
  routineInput.value = "";
};

const addRoutineInputEvent = (routineJson) =>{
  const routineInput = document.querySelector("#addRoutineInput");
  const inputValue = routineInput.value.trim();
  
  const isAlready = routineJson.hasOwnProperty(inputValue.hashCode());

  if(routineNameVerify(inputValue)&&!isAlready){
    const routineListDiv = document.querySelector("#routineListDiv");
    
    let newRoutineDiv = document.createElement("div");
    newRoutineDiv.className = "newRoutineDiv";

    let newRoutineValue = document.createElement("p");
    newRoutineValue.textContent = inputValue;
    newRoutineValue.className = "newRoutineValue";
    let newRoutineButtonDiv = document.createElement("div");
    newRoutineButtonDiv.className = "newRoutineButtonDiv";

    let newRoutineModifyButton = document.createElement("button");
    newRoutineModifyButton.textContent = "수정";
    newRoutineModifyButton.className = "newRoutineModifyButton";
    let newRoutineDeleteButton = document.createElement("button");
    newRoutineDeleteButton.textContent = "삭제";
    newRoutineDeleteButton.className = "newRoutineDeleteButton";
    
    newRoutineButtonDiv.append(newRoutineModifyButton);
    newRoutineButtonDiv.append(newRoutineDeleteButton);

    newRoutineDiv.append(newRoutineValue);
    newRoutineDiv.append(newRoutineButtonDiv);

    routineListDiv.insertBefore(newRoutineDiv,routineListDiv.firstChild);
    //routineListDiv.append(newRoutineDiv);
    routineJson[inputValue.hashCode()] = {};
  }
  routineInput.value = "";
  routineInput.style.display = "none";

  return routineJson;
}

const cancelRoutineInputEvent = () =>{
  const routineInput = document.querySelector("#addRoutineInput");
  routineInput.style.display = "none";
}

const modifRoutineBtnClick = (nodeDiv) =>{
  const routineInput = document.querySelector("#addRoutineInput");
  routineInput.style.display = "";
  routineInput.value = nodeDiv.children[0].textContent;
  return nodeDiv;
}

const modifyRoutineInputEvent = (preKey,routineJson,nodeDiv) =>{
  const routineInput = document.querySelector("#addRoutineInput");
  const inputValue = routineInput.value.trim();

  const isAlready = routineJson.hasOwnProperty(inputValue.hashCode());

  if(routineNameVerify(inputValue)&&!isAlready){
    const preValue = routineJson[preKey];

    const modifyKey = inputValue.hashCode();
    routineJson[modifyKey] = preValue;
    delete routineJson[preKey];

    nodeDiv.children[0].textContent = inputValue;
    routineInput.value = "";
    routineInput.style.display = "none";
  }

  return routineJson;
}

const deleteRoutineBtnClick = (nodeDiv,parentDiv,routineJson) =>{
  const isDelete = window.confirm("정말로 해당 루틴을 삭제하시겠습니까?");
  if(isDelete){
    parentDiv.removeChild(nodeDiv);
    console.log(nodeDiv.children[0].textContent.hashCode());
    delete routineJson[nodeDiv.children[0].textContent.hashCode()];
  }
  return routineJson;
}

const routineNameVerify = (name) =>{
  let isVerify = true;
  if(name.length===0)return false;

  return isVerify;
}

const selectRoutineEvent = (nodeDiv,preSelectDiv,routineJson) =>{
  if(nodeDiv===preSelectDiv)return nodeDiv;
  else{
    nodeDiv.style.backgroundColor = "gray"; 
    preSelectDiv.style = "white";
  }

  const addHealthButton = document.querySelector("#addHealthButton");
  const deleteHealthButton = document.querySelector("#deleteHealthButton");
  const startHealthButton = document.querySelector("#startHealthButton");
  const totalTimeDiv = document.querySelector("#totalTimeDiv");
  addHealthButton.disabled = false;
  deleteHealthButton.disabled = false;
  startHealthButton.disabled = false;
  totalTimeDiv.style.display="";

  const deleteRoutineButton = nodeDiv.getElementsByClassName("newRoutineDeleteButton");
  deleteRoutineButton[0].disabled = true;
  
  if(preSelectDiv.children.length!==0){
    const p_deleteRoutineButton = preSelectDiv.getElementsByClassName("newRoutineDeleteButton");
    p_deleteRoutineButton[0].disabled = false;
  }

  const healthListDiv = document.querySelector("#healthListDiv");
  while(healthListDiv.children.length!==0){
    healthListDiv.removeChild(healthListDiv.children[0]);
  }

  let selectRoutineHealthInfo = routineJson[nodeDiv.children[0].textContent.hashCode()];

  let totalTimeCount = 0;
  Object.keys(selectRoutineHealthInfo).forEach(val=>{
    totalTimeCount+=selectRoutineHealthInfo[val].healthSecond*selectRoutineHealthInfo[val].healthSet;
    let newHealthDiv = document.createElement("div");
    newHealthDiv.className = "newHealthDiv";

    let newHealthCheckBox = document.createElement("input");
    newHealthCheckBox.type = "checkbox";
    newHealthCheckBox.className = "newHealthCheckBox";

    let newHealthValue = document.createElement("p");
    newHealthValue.textContent = selectRoutineHealthInfo[val].healthName+" "+selectRoutineHealthInfo[val].healthSecond+"초 "+selectRoutineHealthInfo[val].healthSet+"세트";
    newHealthValue.className = "newHealthValue";

    let newHealthButtonDiv = document.createElement("div");
    newHealthButtonDiv.className = "newHealthButtonDiv";

    let newHealthModifyButton = document.createElement("button");
    newHealthModifyButton.textContent = "수정";
    newHealthModifyButton.className = "newHealthModifyButton";
    
    newHealthButtonDiv.append(newHealthModifyButton);

    newHealthDiv.append(newHealthCheckBox);
    newHealthDiv.append(newHealthValue);
    newHealthDiv.append(newHealthButtonDiv);

    healthListDiv.append(newHealthDiv);
  })

  totalTimeDiv.children[0].textContent = totalTimeCount/60<1?`전체 시간 : 0분 ${totalTimeCount}초`:`전체 시간 : ${parseInt(totalTimeCount/60)}분 ${totalTimeCount%60}초`;

  return nodeDiv;
}

/*운동 목록 영역*/
const addHealthBtnClick = ()=>{
  const routineInput = document.querySelector("#inputHealthDiv");
  const healthNameInput = document.querySelector("#healthNameInput");
  const healthSecondInput = document.querySelector("#healthSecondInput");
  const healthSetInput = document.querySelector("#healthSetInput");

  healthNameInput.value="";
  healthSecondInput.value="";
  healthSetInput.value="";

  routineInput.style.display = "";
}

const modifyHealthBtnClick = (nodeDiv)=>{
  const routineInput = document.querySelector("#inputHealthDiv");
  routineInput.style.display = "";

  const healthNameInput = document.querySelector("#healthNameInput");
  const healthSecondInput = document.querySelector("#healthSecondInput");
  const healthSetInput = document.querySelector("#healthSetInput");

  const splitValue = nodeDiv.children[1].textContent.split(" ");

  healthNameInput.value = splitValue[0];
  healthSecondInput.value = splitValue[1].split("초")[0];
  healthSetInput.value = splitValue[2].split("세트")[0];

  return nodeDiv;
}

const deleteHealthBtnClick = (currentRoutine,routineJson) =>{
  const healthListDiv = document.querySelector("#healthListDiv");

  while(true){
    let isAllDelete = true;
    for(let i=0;i<healthListDiv.children.length;i++){
      if(healthListDiv.children[i].children[0].checked){
        isAllDelete=false;
        const splitValue = healthListDiv.children[i].children[1].textContent.split(" ");
        const deleteHealthKey = splitValue[0].hashCode()+"-"+splitValue[1].split("초")[0].hashCode()+"-"+splitValue[2].split("세트")[0].hashCode();
  
        delete routineJson[currentRoutine][deleteHealthKey];
        healthListDiv.removeChild(healthListDiv.children[i]);
      }
    }
    if(isAllDelete)break;
  }

  console.log(routineJson);
  return routineJson;
}

const addHealthInputEvent = (routineJson,selectRoutine) =>{
  const healthInput = document.querySelector("#inputHealthDiv");
  let healthName = document.querySelector("#healthNameInput").value.trim();
  let healthSecond = document.querySelector("#healthSecondInput").value;
  let healthSet = document.querySelector("#healthSetInput").value;

  let healthKey = healthName.hashCode()+"-"+healthSecond.hashCode()+"-"+healthSet.hashCode();
  const isAlready = routineJson[selectRoutine].hasOwnProperty(healthKey);

  const totalTimeDiv = document.querySelector("#totalTimeDiv");
  let currentTotalTimeSplit = totalTimeDiv.children[0].textContent.split(" ");
  let currentTotalTime = parseInt(currentTotalTimeSplit[3].split("분")[0])*60+parseInt(currentTotalTimeSplit[4].split("초")[0]);
  if(!isAlready){
    currentTotalTime+=healthSecond*healthSet;
    const healthListDiv = document.querySelector("#healthListDiv");
    
    let newHealthDiv = document.createElement("div");
    newHealthDiv.className = "newHealthDiv";

    let newHealthCheckBox = document.createElement("input");
    newHealthCheckBox.type = "checkbox";
    newHealthCheckBox.className = "newHealthCheckBox";

    if(healthName.length === 0){
      alert("최소 한글자를 입력해주세요.");
      return routineJson;
    };
    if(healthSecond < 10 || healthSecond > 60)healthSecond=30;
    if(healthSet < 1 || healthSet > 10)healthSet=1;

    let newHealthValue = document.createElement("p");
    newHealthValue.textContent = healthName+" "+healthSecond+"초 "+healthSet+"세트";
    newHealthValue.className = "newHealthValue";

    let newHealthButtonDiv = document.createElement("div");
    newHealthButtonDiv.className = "newHealthButtonDiv";

    let newHealthModifyButton = document.createElement("button");
    newHealthModifyButton.textContent = "수정";
    newHealthModifyButton.className = "newHealthModifyButton";
    
    newHealthButtonDiv.append(newHealthModifyButton);

    newHealthDiv.append(newHealthCheckBox);
    newHealthDiv.append(newHealthValue);
    newHealthDiv.append(newHealthButtonDiv);

    healthListDiv.append(newHealthDiv);
    healthInfoJson = {};
    healthInfoJson.healthName = healthName;
    healthInfoJson.healthSecond = healthSecond;
    healthInfoJson.healthSet = healthSet;

    routineJson[selectRoutine][healthKey] = healthInfoJson;
  }
  totalTimeDiv.children[0].textContent = currentTotalTime/60<1?`전체 시간 : 0분 ${currentTotalTime}초`:`전체 시간 : ${parseInt(currentTotalTime/60)}분 ${currentTotalTime%60}초`;
  document.querySelector("#healthNameInput").value = "";
  document.querySelector("#healthSecondInput").value = "";
  document.querySelector("#healthSetInput").value = "";
  healthInput.style.display = "none";
  return routineJson;
}

const modifyHealthInputEvent = (preKey,routineJson,currnetRoutine,nodeDiv) =>{
  const healthInput = document.querySelector("#inputHealthDiv");
  let healthName = document.querySelector("#healthNameInput").value.trim();
  let healthSecond = document.querySelector("#healthSecondInput").value;
  let healthSet = document.querySelector("#healthSetInput").value;

  let healthKey = healthName.hashCode()+"-"+healthSecond.hashCode()+"-"+healthSet.hashCode();
  const isAlready = routineJson[currnetRoutine].hasOwnProperty(healthKey);
  const totalTimeDiv = document.querySelector("#totalTimeDiv");

  let currentTotalTimeSplit = totalTimeDiv.children[0].textContent.split(" ");
  let currentTotalTime = parseInt(currentTotalTimeSplit[3].split("분")[0])*60+parseInt(currentTotalTimeSplit[4].split("초")[0]);
  if(!isAlready){
    if(healthName.length === 0){
      alert("최소 한글자를 입력해주세요.");
      return routineJson;
    };
    if(healthSecond < 10 || healthSecond > 60)healthSecond=30;
    if(healthSet < 1 || healthSet > 10)healthSet=1;

    currentTotalTime-=parseInt(routineJson[currnetRoutine][preKey].healthSecond)*parseInt(routineJson[currnetRoutine][preKey].healthSet);
    currentTotalTime+=healthSecond*healthSet;

    let preValue = routineJson[currnetRoutine][preKey];
    preValue.healthName = healthName;
    preValue.healthSecond = healthSecond;
    preValue.healthSet= healthSet;

    routineJson[currnetRoutine][healthKey] = preValue;
    delete routineJson[currnetRoutine][preKey];

    nodeDiv.children[1].textContent = healthName+" "+healthSecond+"초 "+healthSet+"세트";;

    healthInput.style.display = "none";
  }
  totalTimeDiv.children[0].textContent = currentTotalTime/60<1?`전체 시간 : 0분 ${currentTotalTime}초`:`전체 시간 : ${parseInt(currentTotalTime/60)}분 ${currentTotalTime%60}초`;
  return routineJson;
}

const cancelHealthInputEvent = () =>{
  const healthInput = document.querySelector("#inputHealthDiv");

  healthInput.style.display = "none";
}

const startHealthButton = (totalHealthList) =>{
  const healthListDiv = document.querySelector("#healthListDiv");

  for(let i=0;i<healthListDiv.children.length;i++){
    totalHealthList.push(healthListDiv.children[i].children[1].textContent);
  }

  return totalHealthList;
}

  
module.exports = {
  initRoutineList,
  addRoutineBtnClick,
  addRoutineInputEvent,
  cancelRoutineInputEvent,
  modifRoutineBtnClick,
  modifyRoutineInputEvent,
  deleteRoutineBtnClick,
  routineNameVerify,
  selectRoutineEvent,
  addHealthBtnClick,
  modifyHealthBtnClick,
  deleteHealthBtnClick,
  addHealthInputEvent,
  modifyHealthInputEvent,
  cancelHealthInputEvent,
  startHealthButton
};
  