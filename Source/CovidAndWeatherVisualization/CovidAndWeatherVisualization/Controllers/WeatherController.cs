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
    [Route("[controller]")]
    public class WeatherController : ControllerBase
    {

        public WeatherController()
        {
        }

        [HttpGet("temperature")]
        public async Task<List<TemperatureData>> Get([FromQuery]WeatherDataRequest request)
        {
            return new List<TemperatureData>();
        }
    }
}
