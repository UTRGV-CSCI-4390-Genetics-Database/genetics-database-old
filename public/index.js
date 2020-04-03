myCheck = $("#check").clone(); 
myText = $("#text").clone();
myDate = $("#date").clone();
myNumber = $("#number").clone();
myChar = $("#char").clone();
myReal = $("#real").clone();
myDiv = $("#myDiv").clone();
myIncome = $("#income").clone();
myMarital = $("#marital").clone();
mySex = $("#mySex").clone();
myEthinc = $("#ethnic").clone();
myAccord = $(".card").clone();
const checkBox = function(key1){
  if($('#'+ key1 + ':checked').val()){
    return true;
  }
  else{
    return false;
  }
}
var newObj = {};
for (let [key, value] of Object.entries(data)){
  var tempObj = {};
  for(let[key1, value1] of Object.entries(data[key])){
    var newVal = Array(3); 
    newVal[0] = value1;
    tempObj[key1] = newVal;
  }
  newObj[key] = tempObj;
}

var val; 
const checkInput = function(obj){
  for (let [key, value] of Object.entries(obj)){
    for(let[key1, value1] of Object.entries(obj[key])){
      if(value1[0] =='text' || value1[0] =='char(1)'){
        val = $('#'+ key1).val();
        value1[1] = val;
      }
      else if(value1[0] =='integer' || value1[0] =='smallint' || value1[0] =='real' || value1[0] == 'bigint'){
        val = +$("div[id = '"+key1+"'] input[id = 'in1']").val();
        value1[1] = val;
        val = +$("div[id = '"+key1+"'] input[id = 'in2']").val();
        value1[2] = val;
      }
      else if(value1[0] =='date'){
        val = $("div[id = '"+key1+"'] input[id = 'in1']").val();
        value1[1] = val;
        val = $("div[id = '"+key1+"'] input[id = 'in2']").val();
        value1[2] = val;
      }
      if(value1[0] =='boolean'){
        val = checkBox(key1);
        value1[1] = val;
      }
    }
  }
}

$(".temp").hide(); 
$(document).ready(function(){
  for (let [key, value] of Object.entries(data)){
    myAccord.find("button").text(key);
    myAccord.find("button").attr("data-target", "#"+key);
    myAccord.find(".collapse").attr("id", key);
    for(let[key1, value1] of Object.entries(data[key])){
      if(value1=='boolean'){
        myCheck.find('input').attr("id", key1);
        myCheck.find('label').text(' -' + key1);
        myAccord.find(".card-body").append(myCheck.clone());
      }

      /*else if(value1 == "text"){
        myText.find('input').attr("id", key1);
        myText.find('label').text(key1 + ': ');
        myAccord.find(".card-body").append(myText.clone());
      }*/
      else if(value1 == "text" || value1 == "char(1)"){
        if(value1 == "text" ){
          if(key1 == "ethnicity" || key1 == "father_ethnicity_1" || key1 == "father_ethnicity_2" || key1 == "father_ethnicity_3" || key1 == "father_ethnicity_4" || key1 == "mother_ethnicity_1" || key1 == "mother_ethnicity_2" ||key1 == "mother_ethnicity_3" ||key1 == "mother_ethnicity_4"){
            myVar = myEthinc;
          }
          else if(key1 == "approximate_income"){
            myVar = myIncome;
          }
          else if(key1 == "marital_status"){
            myVar = myMarital;
          }
          else{
            myVar = myText;
          }
        }
        if(value1 == "char(1)"){
          if(key1 == "sex"){
            myVar = mySex;
          }
          else{
             myVar = myChar;
          }   
        }
        myVar.find('.form-control').attr("id", key1);
        myVar.find('label').text(key1 + ': ');
        myAccord.find(".card-body").append(myVar.clone());
      }
      else if(value1 == "integer" || value1 == "smallint" || value1 == 'bigint'){
        if(key1 == "subject_id" && key != "individuals"){}
        else {
          myNumber.attr("id", key1);
          myNumber.find('label').text(key1 + ': ');
          myAccord.find(".card-body").append(myNumber.clone());}
      }
      else if(value1 == "date"){
        myDate.attr("id", key1);
        myDate.find('label').text(key1 + ': ');
        myAccord.find(".card-body").append(myDate.clone());
      }
      /*else if(value1 == "char(1)"){
        myChar.find('input').attr("id", key1);
        myChar.find('label').text(key1 + ': ');
        myAccord.find(".card-body").append(myChar.clone());
      }*/
      else if(value1 == "real"){
        myReal.attr("id", key1);
        myReal.find('label').text(key1 + ': ');
        myAccord.find(".card-body").append(myReal.clone());
      }
    }
    $("#accordion").append(myAccord.clone());
    myAccord.find(".card-body").text("");
  }
  
  $("#b").click(function(){
    checkInput(newObj);
    $('#in').val(JSON.stringify(newObj));
    $('#form').submit();
  });
});
      


