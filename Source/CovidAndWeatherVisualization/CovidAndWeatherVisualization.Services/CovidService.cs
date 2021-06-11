using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core.Models;
using CovidAndWeatherVisualization.DataAccess;
using CovidAndWeatherVisualization.Interfaces;

namespace CovidAndWeatherVisualization.Services
{
    public class CovidService : ICovidService
    {
        private readonly CapstoneDbContext _dbContext;
        private readonly IMapper _mapper;

        public CovidService(CapstoneDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<CovidDataByCounty>> GetCovidDataByCounty()
        {
            var dtos = await _dbContext.GetCovidDataByCounty();
            return _mapper.Map<List<CovidDataByCounty>>(dtos);
        }
    }
}
