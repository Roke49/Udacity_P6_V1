"use strict";
function setup_map(error, geo_data, five_yr_avg, c_map){
  if (error) console.log(error);
  const TimerInterval = 2000; // for animation
  const start_base = 1981, end_base = 1985; // for labeling buttons
  // geo_data: US counties with state and county FIPS codes
  // five_yr_avg: 5-year average heat-wave days per county, rounded
  // to closest integer.
  // c_map: matplotlib "Oranges" color map for range of five_yr_avg data
  var margin = {top:75, right:75, bottom:75, left: 0};
  var container = d3.select("#mapContainer");
  var cWidth = parseInt(container.style("width"));
  var cHeight = parseInt(container.style("height"));
  var svg = container.append("svg")
    .attr("width", cWidth)
    .attr("height", cHeight)
    .attr("class", "mapCanvas");
  var width = cWidth - margin.left - margin.top;
  var height = cHeight - margin.top - margin.bottom;
  // map title
  var mapTitle = svg.append("text")
    .attr("x", cWidth/2).attr("y", margin.top /2 )
    .attr("text-anchor", "middle")
    .attr("id", "mapTitle");

  function setMapTitle(epoch){
    if (epoch == -1){
      mapTitle.text("U.S. Heat Wave Days: Five Year Average Over Time")
    }
    else{
      mapTitle.text("U.S. Heat Wave Days: Five Year Average: " +
      (1981 + 5 * epoch) + "-" + (1985 + 5 * epoch));
    }

  }

  var map = svg.append("g")
      .attr("id", "map")
      .attr("transform", "translate(" + margin.left + "," +
          margin.top + ")");

  // create the county code for each county in the map
  geo_data.features.forEach(function(element){
    element.properties.CountyCode = element.properties.STATEFP +
    element.properties.COUNTYFP
  });
  // for drawing legend: arrays of c_map keys as string and numeric
  var c_map_keys = Object.keys(c_map);
  var c_map_nkeys = [];
  Object.keys(c_map).forEach(function(element){
    c_map_nkeys.push(+element);
  });
  // draw the legend:
  var legX = margin.left + width + 0.3 * margin.right,
      legY = Math.round(margin.top + 0.2 * height), // x,y origin of legnd
      legW = 0.3 * margin.right, // w, h of each block
      legH = Math.round(0.6 * height / c_map_keys.length);

  var legscale = d3.scale.linear()
      .domain(d3.extent(c_map_nkeys))
      .range([height * 0.6, 0]);
  var legend = svg.append("g")
    .attr("transform", "translate(" + legX + "," + legY + ")")
    .attr("id", "legend");
  legend.append("text")
    .attr("x", legW/2)
    .attr("dy", "-1em")
    .attr("class", "legend_title")
    .attr("text-anchor", "middle")
    .text("# of days");
  c_map_keys.forEach(function(element){
    legend.append("rect")
      .attr("x", 0)
      .attr("y", (d3.max(c_map_nkeys) - element) * legH)
      .attr("width", legW).attr("height", legH)
      .attr("fill", c_map[element]);
    if(+element % 5 == 0){
      legend.append("text")
        .attr("x", 0).attr("dx", "-1.5em")
        .attr("y", (d3.max(c_map_nkeys) - element) * legH)
        .attr("dy", "+0.5em")
        .attr("class", "legend_text")
        .text(element);
    }
  }); // legend now drawn

  // set up group to draw buttons for different epochs
  var erHeight = 25;
  var erWidth = 3.5 * erHeight;
  var erPad = 0.4 * erWidth;
  var epoch_rects = svg.append("g")
    .attr("transform", "translate(" + (0.10 * width)  + "," +
          (cHeight - 35) + ")")
    .attr("id", "epoch_rects").classed("drawn", false);
  // setup a spot for messages
  var msgText = epoch_rects.append("text")
    .attr({"x":0, "y": -erHeight, "id":"click_text"})
    .text("");

  function set_fill_color(epoch){
  // set fill color for each county based on epoch to draw
    if (epoch == -1){ // for setup before first epoch drawn
      geo_data.features.forEach(function(element){
        element.properties.FillColor = c_map[1];
      });
    }
    else{
      geo_data.features.forEach(function(element){
        element.properties.FillColor =
          c_map[five_yr_avg[epoch][element.properties.CountyCode]]
          || "#ffffff";
        });
    }
  }

  function draw_map(epoch){
    var projection = d3.geo.albersUsa()
      .scale(1100)
      .translate([width/2, height/2]);
    var path = d3.geo.path().projection(projection);
    // update selection and data bind
    set_fill_color(epoch);
    var the_map = map.selectAll('path')
      .data(geo_data.features);
    // this should update old elements
    the_map.style('fill', function(d){
      return d.properties.FillColor;
    });
    // add new elements - only should happen on first pass
    the_map.enter()
      .append('path')
      .attr('d', path)
      .style('fill', function(d){
        return d.properties.FillColor;
      })
      .style('stroke', 'black')
      .style('stroke-width', 0.5);
  }


  function runAnimation(){
    // if buttons have been drawn, this is a rerun.  Clear buttons
    // and reset map.
    if(epoch_rects.classed("drawn") == true){
      clearEpochButtons();
      draw_map(-1);
    }
    var me = d3.select(this);
    if (me.attr("id") == "playButton"){
      if (me.classed("removed") == false){
        d3.select("#playButton").classed("removed", true);
        d3.select(this).remove();
      }
    }
    setMapTitle(-1);
    var epoch = 0;
    if (epoch_rects.classed("drawn") == false)
      drawEpochButtons();

    var id = setInterval(update_map, TimerInterval)
    map.classed("running", true);
    function update_map(){
      clearEpochButtons();
      highlightEpochButton(epoch);
      setMapTitle(epoch);
      draw_map(epoch);
      epoch += 1;
      if(epoch > 5){
        map.classed("running", false);
        clearInterval(id);
      }
    }
  }

  setMapTitle(-1);
  draw_map(-1);

  // draw initial "play" in center of map
  var pBWidth = 200, pBHeight = 100;
  var playButton = svg.append("g")
    .attr("transform", "translate(" + (cWidth/2 - pBWidth/2) +
      "," + (cHeight/2 - pBHeight/2) + ")")
    .attr("id", "playButton")
    .on("click", runAnimation);
    // .on("click", runAnimation());
  playButton.append("rect")
      .attr("width", pBWidth).attr("height", pBHeight)
      .attr("rx", "5").attr("ry", "5")
      .attr("class", "pBRect");
  playButton.append("text")
      .attr("x", pBWidth / 2).attr("y", pBHeight/2).attr("dy", "0.3em")
      .attr("class", "pbText").attr("text-anchor", "middle")
      .text("Play ▶");

  function redraw_map(){
    // shouldn't do anything if animation is running
    if (map.classed("running") == false){
      // draw the map for a single selected time period
      clearEpochButtons();
      var epoch = +this.id.substr(-1);
      d3.select(this).select("rect").style("fill", "lightgrey");
      setMapTitle(epoch)
      draw_map(epoch);
    }
  }

  function drawEpochButtons () {
    // add button to draw map for each time period
    for (var epoch = 0; epoch < 6; epoch++){
      var erText = (1981 + 5 * epoch) + "-" + (1985 + 5 * epoch);
      var erButton = epoch_rects.append("g")
        .attr("transform", "translate(" + epoch * (erWidth + erPad) +
          "," + "0)")
        .attr("class", "epoch_button").attr("id", "eb_" + epoch)
        .on("click", redraw_map);
      erButton.append("rect")
          .attr("width", erWidth).attr("height", erHeight)
          .attr("rx", "5").attr("ry", "5")
          .attr("class", "epoch_rect");
      erButton.append("text")
          .attr("x", erWidth / 2).attr("y", erHeight/2).attr("dy", "0.3em")
          .attr("class", "epoch_text").attr("text-anchor", "middle")
          .text(erText);
    }
      epoch_rects.append("text")
        .attr({"x":0, "y": -erHeight, "id":"click_text"})
        .text("Click to view time period:");
      var replayButton = epoch_rects.append("g")
        .attr("transform", "translate(" + epoch * (erWidth + erPad) +
          "," + "0)")
        .attr("class", "epoch_button")
        .on("click", runAnimation);
      replayButton.append("rect")
          .attr("width", erWidth * 2).attr("height", erHeight)
          .attr("rx", "5").attr("ry", "5")
          .attr("class", "epoch_rect");
      replayButton.append("text")
          .attr("x", erWidth).attr("y", erHeight/2).attr("dy", "0.3em")
          .attr("class", "epoch_text").attr("text-anchor", "middle")
          .text("Replay Animation");
      epoch_rects.classed("drawn", true);
    }

    function highlightEpochButton(epoch){
      d3.select("#eb_" + epoch)
        .select("rect").style("fill", "lightgrey");
    }
    function clearEpochButtons(){
      d3.selectAll(".epoch_button").select("rect")
        .style("fill", "none");
    }

  }
