const initHealtStart = (healthList) =>{
  const healthListDiv = document.getElementsByClassName("healthStartList");
    
  for(let i=0;i<healthList.length;i++){
    let startHealthDiv = document.createElement("div");
    startHealthDiv.className = `startHealthDiv_${i}`;
    if(i===0)startHealthDiv.style.backgroundColor = "gray";

    let startHealthValue = document.createElement("p");
    startHealthValue.textContent = healthList[i];
    startHealthValue.className = "startHealthValue";

    startHealthDiv.append(startHealthValue);
    healthListDiv[0].append(startHealthDiv);
  }
}

const pauseBtnClick = () => {
  
};

const restartBtnClick = () =>{

}

const completeHealthBtnClick = () =>{

}
  
module.exports = {
  initHealtStart,
  pauseBtnClick,
  restartBtnClick,
  completeHealthBtnClick
};
  