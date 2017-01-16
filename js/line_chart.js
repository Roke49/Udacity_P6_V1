"use strict";
var formatYear = d3.time.format("%Y");
const TimerInterval = 1000;
function setupLineCharts(error, tdata, hwdata){
  if (error){
    console.log("error");
  }
  // get svg canvas dimensions
  var canvas = d3.select("#lineChartCanvas");
  var cWidth = parseInt(canvas.style("width")),
    cHeight = parseInt(canvas.style("height"));
    // mean 20th century temp = 13.7°C (convert to F for viz
  const AvgGlobalTemp = 32 + 9 * 13.7 / 5; // in F
  const FadeDelay = 1000; // for chart transitions
  // for the plot of average global temp over time, add the century
  // average to the Anomaly value converted to F
  tdata.forEach(function(element){
    element.Year = formatYear.parse(element.Year);
    element.Anomaly = 9 * element.Anomaly / 5;
    element.AnnualAverage = element.Anomaly + AvgGlobalTemp;
  });
  // heatwave days data: parse date, convert N_days to number
  // make separate array for 5-year rolling means
  var rmdata = [];
  hwdata.forEach(function(element){
    element.Year = formatYear.parse(element.Year);
    element.N_days = +element.N_days;
    if(element.RM != ""){
      rmdata.push({"Year":element.Year, "RM":+element.RM});
    }
  });
  // set margins and width of chart area;
  var margin = {top: 50, right: 50, bottom: 35, left: 50};
  var width = cWidth - (margin.right + margin.left);
  var height = cHeight - (margin.top + margin.bottom);
  var dimensions = {margin:margin, width:width, height:height};
  // the xscale is used by all the drawing functions so set it up here
  var xextent = d3.extent(tdata, function(d){return d["Year"];});
  var xscale = d3.time.scale()
    .domain(xextent)
    .rangeRound([0, dimensions.width]);

  var chart = canvas.append("g")
    .attr("transform", "translate(" + margin.left +
      "," + margin.top + ")");
  // create each of the chart components with opacity = 0;
  var AnomalyChart = drawAnomalyChart(chart, tdata, dimensions, xscale);
  var TempChart = drawTempChart(chart, tdata, dimensions, xscale);
  var HeatWaveChart = drawHeatWaveChart(chart, hwdata, dimensions, xscale);
  var ChartTitle = setupChartTitle(chart, dimensions);
  var FiveYrAvg = drawFiveYrAvg(chart, rmdata, hwdata, dimensions, xscale);
  // put the xaxis and title on the chart
  drawXAxis(chart, tdata, dimensions, xscale);
  ChartTitle.text("Global Temperature Change / US Summer Heat Waves");
  // disable default behavior of <a> in buttons:
  var graphButtons = document.getElementsByClassName('graphButton');
  for (var i=0; i<graphButtons.length; i++){
    graphButtons[i].addEventListener("click", function(event){
      event.preventDefault();
    });
  }
  // register event handlers for buttons on chart:
  d3.select("#b1").on("click", function (){
    var me = d3.select(this);
    var other = d3.select("#b2")
    debugger;
    if (me.classed("clickedT") == false){
      // need to fade out global temp line and change its button
      if (other.classed("clickedT") == true){
        fadeOut(TempChart, FadeDelay);
        other.classed("clickedT", false);
      }
      fadeIn(AnomalyChart, FadeDelay);
      setChartCaption(1);
      me.classed("clickedT", true);
    }
    else {
      fadeOut(AnomalyChart, FadeDelay);
      me.classed("clickedT", false);
    }
  });
  d3.select("#b2").on("click", function(){
    var me = d3.select(this);
    var other = d3.select("#b1");
    if (me.classed("clickedT") == false){
      // need to fade out temp anomaly chart
      if(other.classed("clickedT") == true){
        fadeOut(AnomalyChart, FadeDelay);
        other.classed("clickedT", false);
      }
      setChartCaption(2);
      fadeIn(TempChart, FadeDelay);
      me.classed("clickedT", true);
    }
    else{
      fadeOut(TempChart, FadeDelay);
      me.classed("clickedT", false);
    }
  });
  d3.select("#b3").on("click", function(){
    var me = d3.select(this);
    var other = d3.select("#b4");
    if (me.classed("clickedHW") == false){
      if (other.classed("clickedHW") == true){
        fadeTo(FiveYrAvg, FadeDelay, 0.5);
      }
      setChartCaption(3);
      fadeIn(HeatWaveChart, FadeDelay);
      me.classed("clickedHW", true);
    }
    else{
      fadeOut(HeatWaveChart, FadeDelay);
      me.classed("clickedHW", false);
    }
  });
  d3.select("#b4").on("click", function(){
    var me = d3.select(this);
    var other = d3.select("#b3");
    if (me.classed("clickedHW") == false){
      if (other.classed("clickedHW") == true){
        fadeTo(HeatWaveChart, FadeDelay, 0.5);
      }
      setChartCaption(4);
      fadeIn(FiveYrAvg, FadeDelay);
      me.classed("clickedHW", true);
    }
    else{
      fadeOut(FiveYrAvg, FadeDelay);
      me.classed("clickedHW", false);
    }
  });

  // draw the first line chart and set the caption
  setChartCaption(1);
  d3.select("#b1").classed("clickedT", true);
  fadeIn(AnomalyChart, FadeDelay);
}
