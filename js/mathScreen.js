var allDisplayBoxes;
var allValuesInsideDisplayBox ;
var allBorrowButtons;
var totalDigits = 4;
var placeValue;   // value changes from 3,2,1,0 representing units, tens, hundreds and thousands places respectively.
var activeBoxColor = 'orange';
var minuendArr = [];
var resultArr = new Array(totalDigits);
var tempMinuendArr = [];


function openMathsProblemScreen(){
  var html = "<button class = 'close' onclick = 'overlay()'></button><ul>"; 
  overlay(html);
  initializeDisplay();
  
  $('.borrow').on('click', function(){
    if($(this).attr('value') == '0'){
      youCantBorrowFromZero();
    }else{
      borrowValue(this);
    }
  });

  $('#numberButtons button').on('click', function(){
    let buttonValue = parseInt($(this).attr('value'));
    console.log(buttonValue);
    $('#resultSubtraction .box.active .valueOfBox').html(buttonValue);
    resultArr[placeValue] = buttonValue;
  });
}

function borrowValue(button){
  let id = $(button).attr('id');

  for(let i=0;i<totalDigits-1;i++){ //going through all the buttons to select the correct one.
    if (id=='borrow'+i){  //when the correct button is  found.
      //change value in the box of the digit that GIVES THE BORROW
      $('.box:nth(' + i +') .valueOfBox').addClass('strikethrough');                            
      $('.box:nth(' + i +')').append('<span class="valueOfBox">'+(tempMinuendArr[i]-1)+'</span>');  
      tempMinuendArr[i]--;  
      //disable the borrow button once clicked
      $(button).attr('disabled','true');  

      //change value of the box THAT RECEIVES THE BORROW
      $('.box:nth(' + (i+1) +') .valueOfBox').prepend('1'); 
      tempMinuendArr[i+1]+=10;
      if(i!=totalDigits-2){   //last button has no need to do this
        $('#borrow'+(i+1)).attr('value', '1');
      }
      
      // WHEN THERE ARE 0's IN BETWEEN
      // if((placeValue-i)>1){   
      //   for(let j=i+1; j<placeValue;j++){
      //     $('.box:nth(' + j +') .valueOfBox').addClass('strikethrough');    
      //     $('.box:nth(' + j +')').append('<span class="valueOfBox">'+9+'</span>');
      //     tempMinuendArr[j] = 9;
      //   }
      // }

    }
  }
  // let index = getIndexOfThisButton(this);
  // strikeThrough(index);
  // $('#minuend .box.active .valueOfBox').prepend('1');
}

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
  allValuesInsideDisplayBox[index].className += ' strikethrough';
  // allValuesInsideDisplayBox[index].appendChild = ''+ oldValue -1;
  $('#minuend .box:nth-of-type('+(index+1)+')').append(oldValue-1);
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
  let num= [parseInt(digits[0]),parseInt(digits[1]),parseInt(digits[2]),parseInt(digits[3])]
  return num;
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

function makeMinuendWithBorrow(n){
  var html='';
  for (let i=0; i<n; i++){
    html+='<div class="box"><button class="borrow" id="borrow'+i +'">B</button><span class="valueOfBox">9</span></div>';
  }
  $('#minuend').html(html);
  $('#borrow3').remove();   //removing the borrow button from Units place
}

function makeMinuend(n){
  var html='';
  for (let i=0; i<n; i++){
    html+='<div class="box"><span class="valueOfBox">9</span></div>';
  }
  $('#minuend').html(html);
}

function makeSubtrahend(n){
  var html='';
  html+= '<span class="minusSign">-</span>';
  for (let i=0; i<n; i++){
    html+='<div class="box"><span class="valueOfBox">9</span></div>';
  }
  $('#subtrahend').html(html);
}

function makeResult(n){
  var html='';
  html+='<div class="shiftLeft"><button onclick="changePlaceValueForward()"><<</button></div>';
  for (let i=0; i<n; i++){
    html+='<div class="box"><span class="valueOfBox">9</span></div>';
  }
  html+='<div class="shiftRight"><button onclick="changePlaceValueBackward()">>></button></div>';
  $('#resultSubtraction').html(html);
}

function initializeDisplay(){
  placeValue = totalDigits -1;
  let result = finalDepth - depth;
  minuendArr = splitNumber(finalDepth);
  tempMinuendArr = splitNumber(finalDepth);

 

  makeMinuend(totalDigits);
  makeSubtrahend(totalDigits);
  makeResult(totalDigits);

   for(let i=0;i<totalDigits-1;i++){  //disabling borrow buttons where the digit is a zero
    if(minuendArr[i] == '0'){
      $('#borrow'+i).attr('value', '0');
    }
  }

  allDisplayBoxes = document.getElementsByClassName("box");
  allValuesInsideDisplayBox = document.getElementsByClassName("valueOfBox");
  allBorrowButtons = document.getElementsByClassName("borrow");

  
  fillBoxesWithValues(finalDepth, 'minuend');
  fillBoxesWithValues(depth, 'subtrahend');
  // fillBoxesWithValues(result, 'result');

  makeTheRelevantBoxesActive();
}

function youCantBorrowFromZero(){
  console.log('You can\'t borrow from zero');
}

function changeValueOfButton(button){
  $(button).attr('value','1');
}