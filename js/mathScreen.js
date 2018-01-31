var allDisplayBoxes = document.getElementsByClassName("box");
var allValuesInsideDisplayBox = document.getElementsByClassName("valueOfBox");
var allBorrowButtons = document.getElementsByClassName("borrow");
var placeValue = 3;   // value changes from 3,2,1,0 representing units, tens, hundreds and thousands places respectively.
var activeBoxColor = 'orange';

/* clicks borrow
  get associated minuend box
  striethrought inner value
  write new value
  prepend '1' to our active value
*/
 $('.borrow').on('click', function(){
  let index = getIndexOfThisButton(this);
  strikeThrough(index);
  $('#minuend .box.active .valueOfBox').prepend('1');
 });
function getIndexOfThisButton(button){
  console.log(button);
  for(let i=0; i<3; i++){
    if(button == allBorrowButtons[i]){
      console.log(i);
       return i;
    }
  }  
  return null;
 // let value=allValuesInsideDisplayBox.innerText;
 // console.log(parseInt(value));
}
function strikeThrough(index){
  console.log(allValuesInsideDisplayBox[index].innerText);
  let oldValue = parseInt(allValuesInsideDisplayBox[index].innerText);
  allValuesInsideDisplayBox[index].className += ' borrowedFrom';
  // allValuesInsideDisplayBox[index].appendChild = ''+ oldValue -1;
  $('#minuend .box:nth-of-type('+(index+1)+')').append(oldValue-1);
}

function openMathsProblemScreen(){
  var html = "<button class = 'close' onclick = 'overlay()'></button><ul>"; 
  overlay(html);
  fillBoxesWithValues(finalDepth, 'minuend');
  fillBoxesWithValues(depth, 'subtrahend');
  let result = finalDepth - depth;
  fillBoxesWithValues(result, 'result');
  makeTheRelevantBoxesActive();
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
    digits = "0" + digits; 
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

function makeTheRelevantBoxesActive(){
  //place*0 , place*1, place *2...+ 
  for(let i=0; i<3; i++){
    let box = allDisplayBoxes[placeValue + i*4];
    box.className += ' ' + 'active';
  }
}
function makeTheRelevantBoxesInactive(){
  for(let i=0; i<3; i++){
    let box = allDisplayBoxes[placeValue + i*4];
    box.classList.remove('active');
  }
}

function changePlaceValueBackward(){   //direction ='forward' or 'backward'
  makeTheRelevantBoxesInactive();
  switch (placeValue){
    case 0:
      placeValue++;
      break;
    case 1:
      placeValue++;
      break;
    case 2:
      placeValue++;
      break;
    case 3:
      placeValue = 0;
  }
  makeTheRelevantBoxesActive();
}

function changePlaceValueForward(){   //direction ='forward' or 'backward'
  makeTheRelevantBoxesInactive();
  switch (placeValue){
    case 0:
      placeValue=3;
      break;
    case 1:
      placeValue--;
      break;
    case 2:
      placeValue--;
      break;
    case 3:
      placeValue--;
  }
  makeTheRelevantBoxesActive();
}


