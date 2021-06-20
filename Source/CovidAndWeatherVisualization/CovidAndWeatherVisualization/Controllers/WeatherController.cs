using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
        private readonly IMapper _mapper;

        public WeatherController(IWeatherService weatherService, IMapper mapper)
        {
            _weatherService = weatherService;
            _mapper = mapper;
        }

        [HttpGet("temperature")]
        public async Task<List<TemperatureData>> Get([FromQuery]WeatherDataRequest request)
        {
            return await _weatherService.GetTemperatureData(_mapper.Map<WeatherDataRequestEntity>(request));
        }
    }
}
