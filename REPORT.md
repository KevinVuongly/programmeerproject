# The global difference in quality of education
## Kevin Vuong 10730141

## Application description
The goal of the application is to show the impact of investing into education has
on the quality of education e.g. the performance of a student.
The world map shows the geographical difference in quality of education expressed in the PISA score.
To get into more detail, the scatterplot and the radar chart try to show the positive effects of investing into education.

![](doc/process.png)

## Technical components

### High level overview
#### World map
The world map is created according to the accumulated PISA score per country. By clicking on a country gets the radar chart updated to the country.

#### Radar chart
The radar chart shows a relative score for each variable. The scores are calculated by looking at the position of the variable between the minimum and maximum of the available data;  

score(x) = (x - x[min]) / (x[max] - x[min])

#### Scatterplot
The scatterplot plots the accumulated PISA score in the x-axis and a variable, which is picked by using the dropdown, in the y-axis. By drawing a regression line there is a clear finding to be made wether the correlation is positive or negative. Just like with the world map, by clicking on a scatterpoint updates the radar chart.

### Files and functions
##### main.js
In this file, all the visualizations ultimately happen. Here are where all the visualizations are called for.
To keep unit interfaces small, I decided to keep the __updateData__, which obviously updates the data formatting, and __updateRadarValues__, which updates the values needed for the radar chart, in the main file.

## Challenges met

## Decisions
