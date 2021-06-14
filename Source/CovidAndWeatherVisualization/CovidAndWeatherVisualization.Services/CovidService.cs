using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<List<CovidDataByCounty>> GetCovidDataByCounty(CovidDataRequest request)
        {
            var orderedDtos = await _dbContext.GetCovidDataByCounty(request);
            var returnList = new List<CovidDataByCounty>();
            CovidDataByCountyDto latestDto;
            foreach (var currentDay in EachDay(request.StartDate.Value, request.EndDate.Value))
            {
                latestDto = orderedDtos.First(dto => dto.Date <= currentDay);
                returnList.Add(new CovidDataByCounty {Date = currentDay});
            }
            return returnList;
        }

        private IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }
    }
}
