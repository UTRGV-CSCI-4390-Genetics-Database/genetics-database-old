var myArr = [];    
var myVar1;
function createTable1(str, arr){
    if(!jQuery.isEmptyObject(arr)){
        $('#'+str).show();
        var myVar = $("#"+str+"-0").clone();
        $("#"+str+"-0").hide();
        var i = 1;
        for (let [key, value] of Object.entries(arr)){
            myVar.attr("id", str + "-" + i);
            myVar.find('.th1').text(key);
            myVar.find('.th2').text(value);
            myVar.find('.th3').text(i);
            $("#" + str).append(myVar.clone());
            i += 1;
        }
        myVar1.show();
        myVar1.find('.th1').text("Total");
        myVar1.find('.th2').text("The number of elements that meet ALL conditions mentioned above - AND behavior.");
        myVar1.find('.th3').text("34");
        $("#" + str).append(myVar1.clone());
    }
}
function createTable2(str, arr){
    if(arr.length){
        $('#'+str).show();
        myVar = $("#"+str+"-0").clone();
        $("#"+str+"-0").hide();
        for(var i = 0; i < arr.length; i++){
            myVar.attr("id", str + "-" + i);
            myVar.find('.th1').text(arr[i]);
            myVar.find('.th3').text(i);
            $("#" + str).append(myVar.clone());
        }
        myVar1.find('.th1').text("Total");
        myVar1.find('.th2').text("The number of elements that meet AT LEAST ONE conditions mentioned above - OR behavior.");
        myVar1.find('.th3').text("34");
        $("#" + str).append(myVar1.clone()); 
    }

    }
var xmlhttp = new XMLHttpRequest();



$(document).ready(function(){
    myVar1 = $(".temp").clone();
    $('table').hide();
xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    myArr = JSON.parse(this.responseText);
    createTable1("ind", myArr.ind);
    createTable1("dem", myArr.demo);
    createTable1("bio", myArr.bio);
    createTable2("med", myArr.medical);
    createTable1("snp", myArr.snp_s);
    createTable2("psy", myArr.psychiatric);
    createTable2("anc", myArr.ancestry);
  }
};
xmlhttp.open("GET", "data.json", true);
xmlhttp.send();



})