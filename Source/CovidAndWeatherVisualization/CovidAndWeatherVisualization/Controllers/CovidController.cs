using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Interfaces;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CovidController : ControllerBase
    {
        private readonly ICovidService _covidService;
        private readonly IMapper _mapper;

        public CovidController(ICovidService covidService, IMapper mapper)
        {
            _covidService = covidService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<List<CovidDataByCounty>> Get([FromQuery]CovidDataRequest request)
        {
            return await _covidService.GetCovidDataByCounty(_mapper.Map<CovidDataRequestEntity>(request));
        }
    }
}
