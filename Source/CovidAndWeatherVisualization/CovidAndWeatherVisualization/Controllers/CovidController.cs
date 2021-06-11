using Microsoft.AspNetCore.Mvc;
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
    public class CovidController : ControllerBase
    {
        private readonly ICovidService _covidService;

        public CovidController(ICovidService covidService)
        {
            _covidService = covidService;
        }

        [HttpGet]
        [Route("Covid")]
        public async Task<List<CovidDataByCounty>> Get([FromQuery]CovidDataRequest request)
        {
            return await _covidService.GetCovidDataByCounty(request);
        }
    }
}
