# Udacity_P6_V1
# Project 6 for Udacity Data Analyst Nanodegree
## Summary
The primary dataset for this project is the CDC Wonder dataset documenting extreme heat events,
county-by-county across the US, for the years 1981-2010.  What these data show is that there has
already been a major increase in the frequency of abnormally hot summer days in the US during
an interval in which the increase in global mean temperature is quite modest.  A secondary message
is that climate changes on a short scale can make it difficult to see the longer term trends, and
that the effects of climate change differ significantly across geographic regions.

## Design
My initial design for the visualization is a set of line charts showing how the global average temperature
has increased only slightly during the decades of the CDC study, while the number of abnormally hot summer days
has gone up almost 3-fold from the beginning to the end of the study period.  This will be followed by a map
of the US showing, at a county level, the average heat wave days over the span of the study, using an animation
to step through the period, perhaps in 5-year increments.  Line charts are chosen as the best type to show changes
over time.  Different colors will be used for the charts of global temperature and the heat wave days allowing them
to be displayed on the same chart.  Temperature and number of days are encoded using position.  On the choropleth map
temperature is encoded using color saturation, and location by position on the map.
### Revision 1:
I felt that the dataset needed more of an introduction, so provided this on this first page which is now index.html.  Moved
the line chart to a separate page and eliminated the explanatory text from the visualization.  Added dashed lines showing
minimum and maximum of the 2 variables displayed to highlight the major (3-fold) increase in heat wave days over the course
of the study, comapred with the very modest change in global mean temperature.  Added the geographic visualization to follow
after the line chart which allows user to see pattern at each time period by clicking at bottom of page.  

## Feedback
Feedback from 4 individuals received on first version, summarized as follows:
Nate Whitson: suggested pulling out css and js into separate files; suggested making graphic resizable and a way to do this
Suggested a cue, perhaps color, to make clear which Y-axis is associated with which line.
Raul Audelo: consider graphic, ? background image, to highlight data and relationship to real-world problems. Let user know
something is happening as data is being rolled out.  
Cynthia Whitson-White commented that some of explanatory text needed to be clarified and simplified, and that when text
was being shown step-wise that time for reading too short.  
Jocelyn Audelo: try to add something at end of display making clear what the overall message is.

### Revision 2:
The Y-axes of the line charts were color-coded to match the colors of the lines.  The animation to display the line charts
in sequence was discarded, and buttons which can be clicked to show the charts were added.  The position of the buttons suggests
the order in which the charts should be viewed, but the user can go back and see any combination.  I decided to abandon the
rolling mean line in favor of 6 discrete 5-year average points, and added bubble-chart type circles to more clearly show the
value at each data point, a double encoding of the 5-year average value.  I pulled all of the html into one file making a single
page, allowing the user to more easily move, by scrolling, between the elements in the presentaiton.

## Feedback on first submission:
Udacity reviewer recommended:
1. Expanding explanatory text in introduction to clearly state the findings communicated by the visualization.
2. Change labeling on Y-axis from "# of days" to "No. of Days".
3. Avoid having next subsection visible on landing section.
4. Use dark orange for five-year average line to be consistent with other encodings.
5. Perhaps adding average temperature change in the U.S. in addition to Global Temperature Change.
6. Make sure key findings are visible on the graphic.
7. Consider finding a way to drill down to more detail (I presume on the map).
Design changes:
* Intorductory text was changed as suggested.
* Labeling on the Heat Wave Days Y-axis was changed as suggested.
* Section spacing changed as suggested.
* Line color changed as suggested.
* I chose not to add additional charts or map features at this point.  I also thought it would be of interest to drill down on the map, showing change at the county level as a tooltip.  Another enhancement which would be interesting is to show start to end change for each county.  I chose not to add these enhancements now due to the time it would require.
