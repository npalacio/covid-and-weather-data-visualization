﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Models;
using CovidAndWeatherVisualization.Interfaces;

namespace CovidAndWeatherVisualization.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CovidController : ControllerBase
    {
        private readonly ICovidService _covidService;

        public CovidController(ICovidService covidService)
        {
            _covidService = covidService;
        }

        [HttpGet]
        public async Task<List<CovidDataByCounty>> Get()
        {
            return await _covidService.GetCovidDataByCounty();
        }
    }
}