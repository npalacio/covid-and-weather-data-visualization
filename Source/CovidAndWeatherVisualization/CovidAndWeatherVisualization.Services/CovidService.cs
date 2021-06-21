using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
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
            var covidDataOrdered = await _dbContext.GetCovidDataByCountyOrdered(new CovidDataRequestEntity
            {
                StartDate = request.StartDate.AddDays(-1),
                EndDate = request.EndDate,
                Fips = request.Fips
            });
            if (covidDataOrdered.Count < 2)
            {
                return new List<CovidDataByCounty>();
            }

            var returnList = new List<CovidDataByCounty>();
            CovidDataByCountyEntity lastFoundDay = covidDataOrdered.FirstOrDefault(_ => _.Date == request.StartDate.Date);
            foreach (var currentDayData in EachDay(request.StartDate, request.EndDate, covidDataOrdered.First()))
            {
                int? newCases;
                var today = covidDataOrdered.FirstOrDefault(dto => dto.Date == currentDayData.Date);

                if (lastFoundDay == null)
                {
                    // Need at least 2 days worth of data to calculate newCases
                    newCases = null;
                }
                else if (today == null)
                {
                    // No data for this day
                    // We have found data before this day, this is a gap
                    newCases = 0;
                }
                else
                {
                    // We have found at least 2 days worth of data
                    newCases = today.CasesCumulative - lastFoundDay.CasesCumulative;
                    lastFoundDay = today;
                }

                currentDayData.CasesNew = newCases;
                returnList.Add(currentDayData);
            }

            return returnList;
        }

        // https://stackoverflow.com/questions/1847580/how-do-i-loop-through-a-date-range
        private IEnumerable<CovidDataByCounty> EachDay(DateTime from, DateTime thru, CovidDataByCountyEntity covidDataByCountyEntity)
        {
            for (var day = from.Date; day.Date <= thru.Date; day = day.AddDays(1))
            {
                var covidDataByCounty = _mapper.Map<CovidDataByCounty>(covidDataByCountyEntity);
                covidDataByCounty.Date = day;
                yield return covidDataByCounty;
            }
        }
    }
}