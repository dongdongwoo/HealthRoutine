/*운동 루틴 영역*/
const addRoutineBtnClick = () => {
  const routineInput = document.querySelector("#addRoutineInput");
  routineInput.style.display = "";
  routineInput.value = "";
};

const addRoutineInputEvent = (routineJson) =>{
  const routineInput = document.querySelector("#addRoutineInput");
  const inputValue = routineInput.value;
  
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

    routineListDiv.append(newRoutineDiv);
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
}

const modifyRoutineInputEvent = (preKey,routineJson,nodeDiv) =>{
  const routineInput = document.querySelector("#addRoutineInput");
  const inputValue = routineInput.value;

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
  addHealthButton.disabled = false;
  deleteHealthButton.disabled = false;

  const healthListDiv = document.querySelector("#healthListDiv");
  while(healthListDiv.children.length!==0){
    healthListDiv.removeChild(healthListDiv.children[0]);
  }

  let selectRoutineHealthInfo = routineJson[nodeDiv.children[0].textContent.hashCode()];

  Object.keys(selectRoutineHealthInfo).forEach(val=>{
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

const deleteHealthBtnClick = () =>{
const isDelete = window.confirm("정말로 해당 운동 목록을 삭제하시겠습니까?");
  if(isDelete){
    
  }
}

const addHealthInputEvent = (routineJson,selectRoutine) =>{
  const healthInput = document.querySelector("#inputHealthDiv");
  const healthName = document.querySelector("#healthNameInput").value;
  const healthSecond = document.querySelector("#healthSecondInput").value;
  const healthSet = document.querySelector("#healthSetInput").value;

  let healthKey = healthName.hashCode()+"-"+healthSecond.hashCode()+"-"+healthSet.hashCode();
  const isAlready = routineJson[selectRoutine].hasOwnProperty(healthKey);

  if(healthInfoVerify(healthName,healthSecond,healthSet)&&!isAlready){
    const healthListDiv = document.querySelector("#healthListDiv");
    
    let newHealthDiv = document.createElement("div");
    newHealthDiv.className = "newHealthDiv";

    let newHealthCheckBox = document.createElement("input");
    newHealthCheckBox.type = "checkbox";
    newHealthCheckBox.className = "newHealthCheckBox";

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
  document.querySelector("#healthNameInput").value = "";
  document.querySelector("#healthSecondInput").value = "";
  document.querySelector("#healthSetInput").value = "";
  healthInput.style.display = "none";
  return routineJson;
}

const modifyHealthInputEvent = (preKey,routineJson,currnetRoutine,nodeDiv) =>{
  const healthInput = document.querySelector("#inputHealthDiv");
  let healthName = document.querySelector("#healthNameInput").value;
  let healthSecond = document.querySelector("#healthSecondInput").value;
  let healthSet = document.querySelector("#healthSetInput").value;

  let healthKey = healthName.hashCode()+"-"+healthSecond.hashCode()+"-"+healthSet.hashCode();
  const isAlready = routineJson[currnetRoutine].hasOwnProperty(healthKey);

  if(healthInfoVerify(healthName,healthSecond,healthSet)&&!isAlready){
    let preValue = routineJson[currnetRoutine][preKey];
    preValue.healthName = healthName;
    preValue.healthSecond = healthSecond;
    preValue.healthSet= healthSet;

    routineJson[currnetRoutine][healthKey] = preValue;
    delete routineJson[currnetRoutine][preKey];

    nodeDiv.children[1].textContent = healthName+" "+healthSecond+"초 "+healthSet+"세트";;

    healthInput.style.display = "none";
  }

  return routineJson;
}

const cancelHealthInputEvent = () =>{
  const routineInput = document.querySelector("#inputHealthDiv");

  routineInput.style.display = "none";
}

const healthInfoVerify = (name,second,set) =>{
  const isHealthVerify = true;

  if(name.length === 0)return false;
  if(second < 10 || second > 60)return false;
  if(set < 1 || set > 10)return false;

  return isHealthVerify;
}

  
module.exports = {
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
  healthInfoVerify
};
  