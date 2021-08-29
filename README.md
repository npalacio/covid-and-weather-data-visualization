# COVID-19 and Weather Data Visualization

## This project has been decomissioned and the website is no longer running. A quick (~7 minute) demonstration of the site while it was up and running can be found [here](https://fcsamerica.zoom.us/rec/share/NARVfmtDhvVpNSwsQX2WpWL3V9ou88UsW9v7_vlnfn-iUDI0Bn2aMffqedTCXVa_.mCaUCGCUcukCFuW9) (Passcode: 1??hKj)

This repository was for my (Nick Palacio's) Masters Capstone Project. This project was a data visualization tool whose purpose was be to enable a classroom activity where students are tasked with investigating weather's role in the COVID-19 pandemic. This tool was a web application implemented using Angular, .NET 5 and Azure.

The full project proposal can be found [here](./Documentation/MastersProject.NickPalacio.pdf).

A zoom recording of the final project presentation can be found [here](https://fcsamerica.zoom.us/rec/share/gqTOD8JxKPao7tbK8hXoyNf0F6DI0qY3_cgN9zoBubQ6kpKh3EDdmSh6oSt6LLYF.rlEQNVPxzXrKuics). Passcode: **r*Dk9y**

The GitHub project board for this can be found [here](https://github.com/npalacio/covid-and-weather-data-visualization/projects/1).

# Architecture
![](./Documentation/ArchitectureDiagram.png)

## Azure App Service
   - The Azure App Service will be responsible for serving up the Angular Application as well as providing several API endpoints for the weather and COVID-19 data.
   - The Weather data will come from an API from [WeatherSource](https://weathersource.com/).
   - The COVID-19 data will come from an Azure SQL Database that will be updated on a recurring basis.
## Azure Function App
   - The Azure Function App will be responsible for loading the COVID-19 data from the dataset from the New York Times hosted on [GitHub](https://github.com/nytimes/covid-19-data). This data is in a CSV format on GitHub.
## Azure SQL Database
   - The Azure SQL Database will be responsible for housing the COVID-19 data.