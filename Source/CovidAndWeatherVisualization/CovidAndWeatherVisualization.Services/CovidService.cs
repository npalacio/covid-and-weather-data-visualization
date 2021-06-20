using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;
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

        public async Task<List<CovidDataByCounty>> GetCovidDataByCounty(CovidDataRequestEntity request)
        {
            // In order to calculate new cases for the first day they passed in we need to fetch data for one day before
            request.StartDate = request.StartDate.AddDays(-1);
            var covidDataOrdered = await _dbContext.GetCovidDataByCountyOrdered(request);
            if (covidDataOrdered.Count < 2)
            {
                return new List<CovidDataByCounty>();
            }
            var returnList = new List<CovidDataByCounty>();
            CovidDataByCountyEntity lastFoundDay = covidDataOrdered.First();
            foreach (var currentDay in EachDay(covidDataOrdered.First().Date.AddDays(1), covidDataOrdered.Last().Date))
            {
                int newCases;
                var today = covidDataOrdered.FirstOrDefault(dto => dto.Date == currentDay);

                //If no data for today, new cases assumed to be 0
                if (today == null)
                {
                    newCases = 0;
                }
                else
                {
                    newCases = today.CasesCumulative - lastFoundDay.CasesCumulative;
                    lastFoundDay = today;
                }

                var currentDayData = _mapper.Map<CovidDataByCounty>(lastFoundDay);
                currentDayData.Date = currentDay;
                currentDayData.CasesNew = newCases;
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
