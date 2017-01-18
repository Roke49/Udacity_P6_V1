// This file has modules for drawing the parts of the line chart
// Mean diurnal tempe range for the continental US is
// about 14°C (25.5°F).  This seems like a reasonable scale for
// plotting mean global temperature.  Mean high and low in Sacramento
// CA are 71 and 46 deg F, exactly 25 degrees apart.
const TempRange = [46, 71]; // of Sac, CA
// radius scale factor for circles in bubble chart
const rScale = 6;

function drawXAxis(chart, tdata, dimensions, xscale){
// draw the common x axis for the chart
  var xaxis = d3.svg.axis()
    .scale(xscale)
    .orient("bottom");
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + dimensions.height + ")")
    .call(xaxis);
  chart.append("text")
    .attr("x", dimensions.width/2)
    .attr("y", dimensions.height + dimensions.margin.bottom)
    .attr("dy", "-0.5em")
    .style("text-anchor", "middle")
    .text("Year")
    .attr("class", "axis_label");
// end drawXAxis
}
function drawAnomalyChart(chart, tdata, dimensions, xscale){
  // draw the line chart of the temperature anomaly data
  var anomyscale = d3.scale.linear()
    .domain([0,1.5])
    .range([dimensions.height, 0]);
  var anomyaxis = d3.svg.axis()
    .scale(anomyscale)
    .orient("left");
  var anomline = d3.svg.line()
    .x(function(d){return xscale(d["Year"]);})
    .y(function(d){return anomyscale(d["Anomaly"]);});
  var AnomalyChart = chart.append("g")
    .attr("class", "AnomalyChart")
    .style("opacity", 0);
  AnomalyChart.append("g")
    .attr("class", "ly axis")
    .attr("id", "anom_yaxis")
    .call(anomyaxis);
  // label it
  AnomalyChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - dimensions.height/2)
    .attr("y", 0 - dimensions.margin.left)
    .attr("class", "axis_label")
    .style("text-anchor", "middle")
    .attr("dy", "1em")
    .text("Degrees Fahrenheit")
  // draw line of temp anomaly on this smaller scale
  AnomalyChart.append("path")
    .datum(tdata)
    .attr("d", anomline)
    .attr("class", "tpath")
    .attr("id", "anom_path");
  return AnomalyChart;
// function drawAnomalyChart end
}
function drawTempChart(chart, tdata, dimensions, xscale){
  var tyscale = d3.scale.linear()
    .domain(TempRange)
    .range([dimensions.height, 0]);
  var tyaxis = d3.svg.axis()
    .scale(tyscale)
    .orient("left");
  // to draw the global average temperature line
  var tline = d3.svg.line()
    .x(function(d){return xscale(d["Year"]);})
    .y(function(d){return tyscale(d["AnnualAverage"]);});
  var TempChart = chart.append("g")
    .attr("class", "TempChart")
    .style("opacity", "0");
  TempChart.append("g")
    .attr("class", "ly axis")
    .call(tyaxis);
  TempChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", 0 - dimensions.height/2)
    .attr("y", 0 - dimensions.margin.left)
    .attr("class", "axis_label")
    .style("text-anchor", "middle")
    .attr("dy", "1em")
    .text("Degrees Fahrenheit")
  TempChart.append("path")
    .datum(tdata)
    .attr("d", tline)
    .attr("class", "tpath");
  //TempChart is svg "g" all drawn but with opacity 0;
  return TempChart;
} // function drawTempChart end

function drawHeatWaveChart(chart, hwdata, dimensions, xscale){
  // draws the heat wave days yearly average line
  var hwmax = d3.max(hwdata, function(d){return d.N_days;});
  var hwmin = d3.min(hwdata, function(d){return d.N_days;});
  var hwextent = [Math.floor(hwmin), Math.ceil(hwmax)];
  var hwyscale = d3.scale.linear()
    .domain(hwextent)
    .range([dimensions.height,0]);
  var ryaxis = d3.svg.axis()
    .scale(hwyscale)
    .orient("right");
  var hwline = d3.svg.line()
    .x(function(d){return xscale(d["Year"]);})
    .y(function(d){return hwyscale(d["N_days"]);});
  var HeatWaveChart = chart.append("g")
    .attr("class", "HeatWaveChart")
    .style("opacity", 0);
  HeatWaveChart.append("g")
    .attr("class", "ry axis")
    .attr("transform", "translate(" + dimensions.width + ", 0)")
    .call(ryaxis);
  HeatWaveChart.append("text")
    .attr("transform", "rotate(+90)")
    .attr("x", 0 + dimensions.height/2)
    .attr("y", 0 - dimensions.width).attr("dy", "-2.5em")
    .attr("class", "axis_label")
    .style("text-anchor", "middle")
    .text("No. of Days");
  HeatWaveChart.append("path")
    .datum(hwdata)
    .attr("d", hwline)
    .attr("class", "hwpath")
    .attr("id", "hwpath1");
  return HeatWaveChart;
} // function drawHeatWaveChart end

function drawFiveYrAvg(chart, rmdata, hwdata, dimensions, xscale){
  // draw a line and bubble chart showing the 6 five-year averages
  // at the intervals used in the map. these are the rolling means
  // centered at 1983, 1988, 1993, 1998, 2003, 2008. can get these
  // by iterating through rmdata by 5's
  var rmsubset = [];
  for (var i = 0; i < rmdata.length; i += 5) rmsubset.push(rmdata[i]);
  var hwmax = d3.max(hwdata, function(d){return d.N_days;});
  var hwmin = d3.min(hwdata, function(d){return d.N_days;});
  var hwextent = [Math.floor(hwmin), Math.ceil(hwmax)];
  var hwyscale = d3.scale.linear()
    .domain(hwextent)
    .range([dimensions.height,0]);
  var ryaxis = d3.svg.axis()
    .scale(hwyscale)
    .orient("right");
  var avgLine = d3.svg.line()
    .x(function(d){return xscale(d.Year);})
    .y(function(d){return hwyscale(d.RM);});
  var FiveYrAvg = chart.append("g")
    .attr("class", "FiveYrAvg")
    .style("opacity", 0);
  FiveYrAvg.append("g")
    .attr("class", "ry axis")
    .attr("transform", "translate(" + dimensions.width + ",0)")
    .call(ryaxis);
  FiveYrAvg.append("text")
    .attr("transform", "rotate(+90)")
    .attr("x", 0 + dimensions.height/2)
    .attr("y", 0 - dimensions.width).attr("dy", "-2.5em")
    .attr("class", "axis_label")
    .style("text-anchor", "middle")
    .text("No. of Days");
  FiveYrAvg.selectAll("circle")
      .data(rmsubset)
      .enter()
        .append("circle").attr("class", "fiveYrCircle")
        .attr("cx", function(d){return xscale(d.Year);})
        .attr("cy", function(d){return hwyscale(d.RM);})
        .attr("r", function(d){return  rScale * Math.sqrt(d.RM);});
  FiveYrAvg.append("path").attr("class", "avgLine")
    .datum(rmsubset)
    .attr("d", avgLine);
  return FiveYrAvg;
}// function drawFiveYrAvg end

function setChartCaption(capNum){
  var title = d3.select("#captionTitle");
  var body = d3.select("#captionText");
  switch (capNum){
    case 1:
      title.text("Earth's Mean Temperature: Annual Change");
      body.text("The graph depicts change in the Earth's mean temperature \
        relative to the average for the first half of the 20th cenury.  \
        The total rise was about 0.7 degrees Fahrenheit during the thirty \
        years of the CDC study.  On this scale the rising trend is clear.");
      break;
    case 2:
      title.text("Earth's Mean Temperature: Absolute Value");
      body.text("Earth's actual average temperature plotted on \
        the scale of the typical daily springtime temperature \
        range in a US city.  On this scale, the overall rise during \
        the years of the CDC study is barely perceptible.");
      break;
    case 3:
      title.text("Summer Heat Wave Days: Yearly Average");
      body.text("The annual average, for all US counties, of the \
        number of heat wave days May through September.  There is \
        considerable year to year variation, making it hard to see if \
        there is any overall trend.")
      break;
    case 4:
      title.text("Summer Heat Wave Days: Five-Year Average");
      body.text("Average number of heat wave days for \
        five-year periods over the course of the CDC study. Size of circle \
        denotes number of days.  A rising trend, is apparent, \
        especially at the end.")
      break;
  }
} //function setChartCaption end
