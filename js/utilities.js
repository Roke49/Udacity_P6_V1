function fadeTo(sel, dur, target){
  sel.transition().duration(dur).style("opacity", target);
}

function fadeIn(sel, dur){
  // set d3 selection sel to opacity 1.0 over duration dur
  fadeTo(sel, dur, 1.0);
}
function fadeOut(sel, dur){
  fadeTo(sel, dur, 0);
}
function setupChartTitle(chart, dimensions){
  ChartTitle = chart.append("text")
      .attr("x", dimensions.width/2)
      .attr("y", 0)
      .attr("dy", "-0.5em")
      .attr("class", "chart_title")
      .style("text-anchor", "middle");
  return ChartTitle;
}
