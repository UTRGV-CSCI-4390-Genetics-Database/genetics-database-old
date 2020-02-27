var panel;
var panelError;
var items = [];
var searchStr = "";
var searchArr = "";

function outPanel(p, n, d){
    for(i = 0; i < n; i++){
        p.find("h3 a").text(d[i].title).attr("href", d[i].url).attr("target", "_blank");
        p.find(".url").text(d[i].url);
        p.find(".excerpt").text(d[i].excerpt.slice(0, 1000)+ "...");
        p.find(".rel").text("Relevance: " + d[i].rel_score);
        $("#results").after(p.clone());
    }
}

$(document).ready(function(){
    panel = $(".panel").clone();
    panelError = $(".panel").clone();
    panelError.find(".panel-body").html("<h1>I do not understand what you mean</h1>");
    $(".panel").hide();
    $("button").click(function(){
        $(".panel").hide();
        $("#results").after(panelError.clone());
        searchStr = "";
        searchArr = "";
        items = [];
        searchStr = $("#search").val();
        searchArr = searchStr.split(" ");
        searchArr.forEach(function(el){
            $.getJSON(el + ".json", function (data) {
                data.forEach(function(el){
                    items.push(el);
                    })
                if(items.length){
                    var newArr = items.sort(function(a, b) {
                        return parseFloat(a.rel_score) - parseFloat(b.rel_score);
                        });
                    $(".panel").hide();
                    outPanel(panel, newArr.length, newArr);
                }
            });
        });
    });
});
