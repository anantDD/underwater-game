var allDisplayBoxes = document.getElementsByClassName("box");
var allValuesInsideDisplayBox = document.getElementsByClassName("valueOfBox");

var activeBoxColor = 'orange';

function openMathsProblemScreen(){
  var html = "<button class = 'close' onclick = 'overlay()'></button><ul>"; 
  overlay(html);
  fillBoxesWithValues(finalDepth, 'minuend');
  fillBoxesWithValues(depth, 'subtrahend');
  let result = finalDepth - depth;
  fillBoxesWithValues(result, 'result');
}

function fillBoxesWithValues(num, type){
  let n = splitNumber(num);
  let index = getIndexOfRelevantBoxes(type);
  for(let i=0; i<n.length; i++){
    allValuesInsideDisplayBox[index+i].innerText = n[i];
  }
}
function splitNumber(n){
  let digits= ("" + n);
  if(n<10){
    digits = "000" + digits;
  }else if(n<100){
    digits = "00" + digits;
  }else if(n<1000){
    digits = "000" + digits; 
  }
  // digits = digits.split("");
  return digits;
}

function getIndexOfRelevantBoxes(type){
  switch (type){
    case 'minuend':
      return 0;
    
    case 'subtrahend':
      return 4;
    case 'result':
      return 8; 
  }
    
}