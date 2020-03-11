var myVar;
var myObj = {ind : {}, demo : {}, bio : {}, medical : [], snp_s : {}, psychiatric : [], ancestry : []};
var myStr = {};
var arr = [];
function objToStr(target, key, val){
  if(val != ""){
      var tempObj = {};
      tempObj[key] = val;
      Object.assign(target, tempObj);
  }
}    
function newTab() {
      var form = document.createElement("form");
      form.method = "GET";
      form.action = "/results";
      document.body.appendChild(form);
      form.submit();
 }
$(document).ready(function(){

  myVar = $("#ind-0").clone();
  for(var i = 1; i < ind.length; i++){
    myVar.attr("id", "ind-" + i);
    myVar.find('input').attr("placeholder", ind[i]);
    myVar.find('input').attr("id", "indN-" + i);
    $("#ind").append(myVar.clone());
  }

  myVar = $("#demo-0").clone();
  for(var i = 1; i < demo.length; i++){
    myVar.attr("id", "demo-" + i);
    myVar.find('input').attr("placeholder", demo[i]);
    myVar.find('input').attr("id", "demoN-" + i);
    $("#demo").append(myVar.clone());
  }

  myVar = $("#bio-0").clone();
  for(var i = 1; i < biological.length; i++){
    myVar.attr("id", "bio-" + i);
    myVar.find('input').attr("placeholder", biological[i]);
    myVar.find('input').attr("id", "bioN-" + i);
    $("#bio").append(myVar.clone());
  }
    
  myVar = $("#medical-0").clone(true);
  for(var i = 1; i < medical.length; i++){
    myVar.attr("id", "medical-" + i);
    myVar.find('input').attr("value", medical[i]);
    myVar.find('label').text(medical[i]);
    $("#medical").append(myVar.clone(true));
  }
  
  myVar = $("#snp_s-0").clone();
  for(var i = 1; i < snp_s.length; i++){
    myVar.attr("id", "snp_s-" + i);
    myVar.find('input').attr("placeholder", snp_s[i]);
    myVar.find('input').attr("id", "snp_sN-" + i);
    $("#snp_s").append(myVar.clone());
  }

  myVar = $("#psychiatric-0").clone(true);
  for(var i = 1; i < psychiatric.length; i++){
    myVar.attr("id", "psychiatric-" + i);
    myVar.find('input').attr("value", psychiatric[i]);
    myVar.find('label').text(psychiatric[i]);
    $("#psychiatric").append(myVar.clone(true));
  }


  myVar = $("#ancestry-0").clone(true);
  for(var i = 1; i < ancestry.length; i++){
    myVar.attr("id", "ancestry-" + i);
    myVar.find('input').attr("value", ancestry[i]);
    myVar.find('label').text(ancestry[i]);
    $("#ancestry").append(myVar.clone(true));
  }

  $("#medical1").click(function(){
    $("input[name='medical[]']").prop("checked", true);
  });
  $("#medical0").click(function(){
    $("input[name='medical[]']").prop("checked", false);
  });

  $("#ancestry1").click(function(){
    $("input[name='ancestry[]']").prop("checked", true);
  });
  $("#ancestry0").click(function(){
    $("input[name='ancestry[]']").prop("checked", false);
  });
  
  $("#psychiatric1").click(function(){
    $("input[name='psychiatric[]']").prop("checked", true);
  });
  $("#psychiatric0").click(function(){
    $("input[name='psychiatric[]']").prop("checked", false);
  });
  $("#b").click(function(){
    var myStr = "indN-";
    for(var i = 0; i < ind.length; i++){
      var key = ind[i];
      var val = $('#'+ myStr + i).val();
      objToStr(myObj.ind, key, val)
    }

    var myStr = "demoN-";
    for(var i = 0; i < demo.length; i++){
      var key = demo[i];
      var val = $('#'+ myStr + i).val();
      objToStr(myObj.demo, key, val)
    }

    var myStr = "bioN-";
    for(var i = 0; i < biological.length; i++){
      var key = biological[i];
      var val = $('#'+ myStr + i).val();
      objToStr(myObj.bio, key, val)
    }

    myObj.medical = $("input[name='medical[]']:checked").map(function() { 
      return this.value; 
    }).get();

    myObj.ancestry = $("input[name='ancestry[]']:checked").map(function() { 
      return this.value; 
    }).get();

    myObj.psychiatric = $("input[name='psychiatric[]']:checked").map(function() { 
      return this.value; 
    }).get();
  
    $.ajax({
      type: 'POST',
      data: JSON.stringify(myObj),
      contentType: 'application/json',
      url: '/',						
      success: function(data) {
          console.log('success');
      }
    });
    newTab();
  });
});


