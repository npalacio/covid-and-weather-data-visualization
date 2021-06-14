﻿using System;
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
            CovidDataByCountyDto latestDto = null;
            foreach (var currentDay in EachDay(request.StartDate.Value, request.EndDate.Value))
            {
                latestDto = orderedDtos.FirstOrDefault(dto => dto.Date == currentDay) ?? latestDto;
                returnList.Add(new CovidDataByCounty {Date = currentDay, Cases = latestDto.Cases});
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
