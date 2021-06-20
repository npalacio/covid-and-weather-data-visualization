using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;
using CovidAndWeatherVisualization.Interfaces;

namespace CovidAndWeatherVisualization.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WeatherController : ControllerBase
    {
        private readonly IWeatherService _weatherService;

        public WeatherController(IWeatherService weatherService)
        {
            _weatherService = weatherService;
        }

        [HttpGet("temperature")]
        public async Task<List<TemperatureData>> Get([FromQuery]WeatherDataRequest request)
        {
            return await _weatherService.GetTemperatureData(request);
        }
    }
}
