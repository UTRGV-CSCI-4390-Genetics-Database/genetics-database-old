const checkBox = function(key1){
    if($('#'+ key1 + ':checked').val()){
      return true;
    }
    else{
      return false;
    }
  }
const checkInput = function(obj){
    for (let [key, value] of Object.entries(obj)){
      for(let[key1, value1] of Object.entries(obj[key])){
          val = checkBox(key1);
          value1[1] = val;
        }
    }
  }
const columnList = function(data){
  for (let [key, value] of Object.entries(data)){
    myAccord.find("button").text(key);
    myAccord.find("button").attr("data-target", "#"+key);
    myAccord.find(".collapse").attr("id", key);
    for(let[key1, value1] of Object.entries(data[key])){
      if(key1 == "subject_id" && key != "individuals"){}
      else {
        if(!(key == "projects" || key == "project_enrollments" || key == "markers")){
          myCheck.find('input').attr("id", key1);
          myCheck.find('label').text(' -' + key1);
          myAccord.find(".card-body").append(myCheck.clone());}
        else{
          myCheckDis.find('input').attr("id", key1);
          myCheckDis.find('label').text(' -' + key1);
          myAccord.find(".card-body").append(myCheckDis.clone());}
        }
      }
    }
    $("#accordion").append(myAccord.clone());
    myAccord.find(".card-body").text("");
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
columnArray = [];
const getColumnArray = function(arr, obj){
    str = "";
    for (let [key, value] of Object.entries(obj)){
      if(!(key == "projects" || key == "project_enrollments" || key == "markers")){
        for(let[key1, value1] of Object.entries(obj[key])){
          if(value1[1]==true){
            if(key1 == "subject_id" && key != "individuals"){}
            else {
              str = key + "." + key1;
              arr.push(str);
            }
          }
        }    
      }
    }
  }
const queryString = function(arrCol, arrQuery){
var join = " FROM individuals JOIN demographics ON individuals.subject_id = demographics.subject_id JOIN biological_measurements ON demographics.subject_id = biological_measurements.subject_id JOIN psychiatric_disorders ON biological_measurements.subject_id = psychiatric_disorders.subject_id JOIN medical_history ON psychiatric_disorders.subject_id = medical_history.subject_id" ;
var columnsNames = "";
for(i = 0; i < arrCol.length; i++){
    columnsNames += arrCol[i] + ", ";
} 
var firstPart = "SELECT " + columnsNames.substring(0, columnsNames.length - 2) + join;
myQuery ="";
for(i = 0; i < arrQuery.length; i++){
   myQuery += firstPart + " WHERE" + arrQuery[i] + " INTERSECT ALL "
} 
return myQuery.substring(0, myQuery.length - 14);
}
$(document).ready(function(){
    myCheck = $("#check").clone(); 
    myCheckDis = $("#checkDis").clone(); 
    myAccord = $(".card").clone();
    searchArray = [];
    for(i = 0; i <$("#list li").length; i++ ){
        arr = ($('li')[i].innerText).split("WHERE");
        searchArray.push(arr[1]);
    }
    $(".temp").hide(); 
    $("#b2").click(function(){
        $(".container-fluid").append("<h3 class = 'results'>Select the columns of your table</h3>");
        columnList(data);
        $("#fm").show();
    });
    $("#b").click(function(){
        checkInput(newObj);
        getColumnArray(columnArray, newObj);
        $('#in').val(queryString(columnArray, searchArray));
        $('#form').submit();
     });
    
});