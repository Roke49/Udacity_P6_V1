// This file does all the stuff which happens in the legend area below
// the line chart.
const LDelay = 1000;
function show_legend(ln){
  var box = d3.select(".legend_box");
  var dy = 1.5 * parseInt(box.style("font-size"), 10);
  var dx = 0.1 * parseInt(box.style("width"), 10);
  var linex1 = 0.55 * parseInt(box.style("width"), 10);
  var linex2 = linex1 + 70;
  switch(ln){
    case 0:
      box.append("text")
        .attr("x", dx).attr("y", dy)
        .text("Change in Earth's mean temperature from 1900-1950 average.")
        .attr("id", "leg_0")
        .style("opacity", 0)
        .transition().duration(LDelay).style("opacity", 1.0);
      box.append("line")
        .attr("id", "leg_0_l")
        .attr("x1", linex1).attr("x2", linex2)
        .attr("y1", dy - 2).attr("y2", dy - 2)
        .style("opacity", 0)
        .transition().duration(LDelay).style("opacity", 1.0);
      break;
    case 1:
      d3.select("#leg_0").remove();
      box.append("text")
        .attr("x", dx).attr("y", dy + "px")
        .text("Earth's mean temperature on scale of typical US springtime day.")
        .attr("id", "leg_1")
        .style("opacity", 0)
        .transition().duration(LDelay).style("opacity", 1.0);
      break;
    case 2:
      box.append("text")
        .attr("x", dx).attr("y", 2*dy + "px")
        .text("Yearly nationwide average number of heat wave days.")
        .attr("id", "leg_2")
        .style("opacity", 0)
        .transition().duration(LDelay).style("opacity", 1.0);
        box.append("line")
          .attr("x1", linex1).attr("x2", linex2)
          .attr("y1", 2 * dy - 2).attr("y2", 2 * dy - 2)
          .attr("id", "leg_2_l")
          .style("opacity", 0)
          .transition().duration(LDelay).style("opacity", 1.0);

      break;
    case 3:
      d3.select("#leg_2").remove();
      d3.select("#leg_2_l").remove();
      box.append("text")
        .attr("x", dx).attr("y", 2*dy - 2)
        .text("Rolling five-year average number of heat wave days.")
        .attr("id", "leg_3")
        .style("opacity", 0)
        .transition().duration(LDelay).style("opacity", 1.0);
        box.append("line")
          .attr("id", "leg_3_l")
          .attr("x1", linex1).attr("x2", linex2)
          .attr("y1", 2 * dy - 2).attr("y2", 2 * dy - 2)
          .style("opacity", 0)
          .transition().duration(LDelay).style("opacity", 1.0);
      break;
  }
}
function add_buttons(){
    var box = d3.select(".legend_box");
    var lbWidth = parseInt(box.style("width"));
    var lbHeight = parseInt(box.style("height"));
    var bWidth = 100, bHeight = 25;
    var navBack = box.append("g")
      .attr("transform", "translate(" + (lbWidth/2 - 2 * bWidth) + "," +
        (0.65 * lbHeight) + ")")
      .attr("id", "navBack")
      .on("click", function(){window.location = "index.html";});
    navBack.append("rect")
      .attr({"width":bWidth, "height":bHeight, "rx":"5","ry":"5"})
      .attr({"stroke":"black", "stroke-width":"1px"})
      .style("fill", "none");
    navBack.append("text")
        .attr({"x":bWidth/2, "y":bHeight/2,"dy":"0.3em"})
        .attr("text-anchor", "middle")
        .text("Back");
    var navNext = box.append("g")
      .attr("transform", "translate(" + (lbWidth/2 + bWidth) + "," +
            (0.65 * lbHeight) + ")")
          .attr("id", "navNext")
          .on("click", function(){window.location = "us_counties_map.html";});
      navNext.append("rect")
        .attr({"width":bWidth, "height":bHeight, "rx":"5","ry":"5"})
        .attr({"stroke":"black", "stroke-width":"1px"})
        .style("fill", "none");
      navNext.append("text")
        .attr({"x":bWidth/2, "y":bHeight/2,"dy":"0.3em"})
        .attr("text-anchor", "middle")
        .text("Next");


}
