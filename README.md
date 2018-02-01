# The global difference in quality of education
## Kevin Vuong 10730141

https://kevinvuongly.github.io/programmeerproject/project/templates/index.html

## Problem statement
Every country differs from quality of education.
For example, given the PISA index in 2015, Singapore scored way higher than Indonesia in every aspect.
Striking is the fact that the richer countries score higher than the poorer countries.
By making an interactive visualization of possible factors for example education spending, GDP or teacher salaries,
we try to show that investing, directly and indirectly, into education has a positive effect on the quality of education.

## Solution

##### Summary
The main visualization is the world map based on the PISA scores for it's legend,
radar chart linked to this visualization get updated by clicking on a country.
The scatterplot with regressionline is used to view for positive correlations.

##### screenshots
![](doc/hover.png)
![](doc/updateradar.png)

##### Main features
- Different event listeners like onclick and hover (MVP)
- Dropdown to pick values to change the visualizations for
- Slider to change for which year you want to see

## Prerequisites

### Data sources

###### Pisa scores
https://data.oecd.org/pisa/reading-performance-pisa.htm  
https://data.oecd.org/pisa/mathematics-performance-pisa.htm  
https://data.oecd.org/pisa/science-performance-pisa.htm

###### Teacher salaries
https://data.oecd.org/eduresource/teachers-salaries.htm

###### Education spending
https://data.oecd.org/eduresource/education-spending.htm

###### GDP per country
https://data.oecd.org/gdp/gross-domestic-product-gdp.htm

### External components
[Bootstrap](https://getbootstrap.com/) - The web framework used for front-end (under MIT License)
[D3, including queue() and topojson](https://github.com/d3/d3) - Library used to create dynamic visualizations (under BSD 3-Clause "New" or "Revised" License)
[jQuery](https://jquery.org) - The web framework used for handle events (under MIT License)

## License
This project is licensed under the The Unlicense - see the [LICENSE](LICENSE) file for details
