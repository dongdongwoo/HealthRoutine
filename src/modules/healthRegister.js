/*운동 루틴 영역*/
//운동 완료, 멈추기 버튼을 클릭 후 이전의 운동 등록화면을 보여주기 위한 함수
const initRoutineList = (routineList) =>{
  const header = document.getElementsByClassName("header");
  header[0].children[0].textContent = "매일 운동 루틴";

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

//운동 루틴 생성 버튼 클릭 이벤트
const addRoutineBtnClick = () => {
  const routineInput = document.querySelector("#addRoutineInput");
  routineInput.style.display = "";
  routineInput.value = "";
};

//운동 루틴 입력 엔터 클릭시 발생 하는 이벤트 
const addRoutineInputEvent = (routineJson) =>{
  const routineInput = document.querySelector("#addRoutineInput");
  const inputValue = routineInput.value.trim();//trim을 사용해 양쪽 공백 제거
  
  const isAlready = routineJson.hasOwnProperty(inputValue.hashCode());//이미 잇는 루틴를 체크하고자 함

  if(routineNameVerify(inputValue)&&!isAlready){//생성하고자 하는 루틴의 이름이 유효한지 체크
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

    routineListDiv.insertBefore(newRoutineDiv,routineListDiv.firstChild);//append가 아닌 insertBefore를 이용해 마지막에 추가한 루틴을 상단에 보여준다
    routineJson[inputValue.hashCode()] = {};
  }
  routineInput.value = "";
  routineInput.style.display = "none";

  return routineJson;
}

//입력 취소 이벤트
const cancelRoutineInputEvent = () =>{
  const routineInput = document.querySelector("#addRoutineInput");
  routineInput.style.display = "none";
}

//루틴 수정 버튼 클릭 이벤트
const modifRoutineBtnClick = (nodeDiv) =>{
  const routineInput = document.querySelector("#addRoutineInput");
  routineInput.style.display = "";
  routineInput.value = nodeDiv.children[0].textContent;
  return nodeDiv;
}

//루틴 수정 입력 엔터키 클릭 이벤트
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

//루틴 삭제 이벤트 
const deleteRoutineBtnClick = (nodeDiv,parentDiv,routineJson) =>{
  const isDelete = window.confirm("정말로 해당 루틴을 삭제하시겠습니까?");
  if(isDelete){
    parentDiv.removeChild(nodeDiv);
    delete routineJson[nodeDiv.children[0].textContent.hashCode()];
  }
  return routineJson;
}

//루틴 이름 유효한지 체크 최소 한글자는 있어야 한다.
const routineNameVerify = (name) =>{
  let isVerify = true;
  if(name.length===0)return false;

  return isVerify;
}

//루틴을 선택했을때 발생하는 이벤트
const selectRoutineEvent = (nodeDiv,preSelectDiv,routineJson) =>{
  //선택하면 예전꺼는 그대로 선택한 노드는 하이라이트
  if(nodeDiv===preSelectDiv)return nodeDiv;
  else{
    nodeDiv.style.backgroundColor = "gray"; 
    preSelectDiv.style.backgroundColor = "white";
  }

  const addHealthButton = document.querySelector("#addHealthButton");
  const deleteHealthButton = document.querySelector("#deleteHealthButton");
  const startHealthButton = document.querySelector("#startHealthButton");
  const totalTimeDiv = document.querySelector("#totalTimeDiv");
  addHealthButton.disabled = false;
  deleteHealthButton.disabled = false;
  startHealthButton.disabled = false;
  totalTimeDiv.style.display="";

  //선택된 운동 루틴이 삭제되면 운동 항목 부분도 날아가고 추가로 UI기능 요건이 없기때문에 disable처리
  const deleteRoutineButton = nodeDiv.getElementsByClassName("newRoutineDeleteButton");
  deleteRoutineButton[0].disabled = true;
  
  if(preSelectDiv.children.length!==0){
    const p_deleteRoutineButton = preSelectDiv.getElementsByClassName("newRoutineDeleteButton");
    p_deleteRoutineButton[0].disabled = false;
  }

  //선택한 운동 루틴에 따른 운동 항목을 보여주어야 하기 때문에 기존의 운동 항목 제거
  const healthListDiv = document.querySelector("#healthListDiv");
  while(healthListDiv.children.length!==0){
    healthListDiv.removeChild(healthListDiv.children[0]);
  }

  let selectRoutineHealthInfo = routineJson[nodeDiv.children[0].textContent.hashCode()];

  //선택한 운동 루틴에 등록된 운동 항목 다시 append
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

//운동 추가 버튼 클릭 이벤트
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

//운동 수정 버튼 클릭 이벤트
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

//운동 삭제 버튼 클릭 이벤트
const deleteHealthBtnClick = (currentRoutine,routineJson) =>{
  const healthListDiv = document.querySelector("#healthListDiv");
  const totalTimeDiv = document.querySelector("#totalTimeDiv");
  let currentTotalTimeSplit = totalTimeDiv.children[0].textContent.split(" ");
  let currentTotalTime = parseInt(currentTotalTimeSplit[3].split("분")[0])*60+parseInt(currentTotalTimeSplit[4].split("초")[0]);

  //여러개 선택시 removeChild을 하면 for문이 종료되기 때문에 while을 이용해 checked된 노드를 찾고 해당 div에서 삭제
  //삭제시 전체시간 역시 줄어들어야 하기 때문에 totatlTime에서 삭제하는 second*set 계산하여 빼도록 설정
  while(true){
    let isAllDelete = true;
    for(let i=0;i<healthListDiv.children.length;i++){
      if(healthListDiv.children[i].children[0].checked){
        isAllDelete=false;
        const splitValue = healthListDiv.children[i].children[1].textContent.split(" ");
        const deleteHealthKey = splitValue[0].hashCode()+"-"+splitValue[1].split("초")[0].hashCode()+"-"+splitValue[2].split("세트")[0].hashCode();
        currentTotalTime-=parseInt(splitValue[1].split("초")[0])*parseInt(splitValue[2].split("세트")[0]);

        delete routineJson[currentRoutine][deleteHealthKey];
        healthListDiv.removeChild(healthListDiv.children[i]);
      }
    }
    if(isAllDelete)break;
  }
  totalTimeDiv.children[0].textContent = currentTotalTime/60<1?`전체 시간 : 0분 ${currentTotalTime}초`:`전체 시간 : ${parseInt(currentTotalTime/60)}분 ${currentTotalTime%60}초`;
  return routineJson;
}

//운동 항목 입력 엔터 클릭 이벤트
const addHealthInputEvent = (routineJson,selectRoutine) =>{
  const healthInput = document.querySelector("#inputHealthDiv");
  let healthName = document.querySelector("#healthNameInput").value.trim();//양쪽 공백제거
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

    //최소 한 글자는 필요
    if(healthName.length === 0){
      alert("최소 한글자를 입력해주세요.");
      return routineJson;
    };
    //만약 기준치에 맞지 않다면 default 값 추가
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
  //값이 추가될때마다 전체 운동 시간 내역 업데이트
  totalTimeDiv.children[0].textContent = currentTotalTime/60<1?`전체 시간 : 0분 ${currentTotalTime}초`:`전체 시간 : ${parseInt(currentTotalTime/60)}분 ${currentTotalTime%60}초`;
  document.querySelector("#healthNameInput").value = "";
  document.querySelector("#healthSecondInput").value = "";
  document.querySelector("#healthSetInput").value = "";
  healthInput.style.display = "none";
  return routineJson;
}

//운동 수정 입력 엔터 클릭 이벤트 = 생성과 동일
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

//운동 입력 취소 버튼 이벤트
const cancelHealthInputEvent = () =>{
  const healthInput = document.querySelector("#inputHealthDiv");

  healthInput.style.display = "none";
}

//운동 시작 버튼 클릭 이벤트
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
  