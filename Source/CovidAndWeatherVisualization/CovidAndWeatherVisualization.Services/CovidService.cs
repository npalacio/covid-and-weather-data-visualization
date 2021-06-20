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
            if (orderedDtos.Count < 2)
            {
                return new List<CovidDataByCounty>();
            }
            var returnList = new List<CovidDataByCounty>();
            CovidDataByCountyDto lastFoundDay = orderedDtos.First();
            foreach (var currentDay in EachDay(orderedDtos.First().Date.AddDays(1), orderedDtos.Last().Date))
            {
                int newCases;
                var today = orderedDtos.FirstOrDefault(dto => dto.Date == currentDay);

                //If no data for today, new cases assumed to be 0
                if (today == null)
                {
                    newCases = 0;
                }
                else
                {
                    newCases = today.Cases - lastFoundDay.Cases;
                    lastFoundDay = today;
                }

                var currentDayData = _mapper.Map<CovidDataByCounty>(lastFoundDay);
                currentDayData.Date = currentDay;
                currentDayData.Cases = newCases;
                returnList.Add(currentDayData);
            }
            return returnList;
        }

        // https://stackoverflow.com/questions/1847580/how-do-i-loop-through-a-date-range
        private IEnumerable<DateTime> EachDay(DateTime from, DateTime thru)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
                yield return day;
        }
    }
}
