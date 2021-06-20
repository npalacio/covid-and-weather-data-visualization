using System;
using AutoMapper;
using CovidAndWeatherVisualization.Core.Profiles;
using CovidAndWeatherVisualization.DataAccess;
using CovidAndWeatherVisualization.Services;
using FakeItEasy;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Interfaces;

namespace CovidAndWeatherVisualization.UnitTests
{
    public class WeatherServiceTests
    {
        [TestCase(0)]
        [TestCase(1)]
        [TestCase(365)]
        public async Task GetTemperatureData_WithDateRangeLessThanAYear_CallsServiceAgentOnce(int dayRange)
        {
            // Arrange
            var fakeServiceAgent = A.Fake<IWeatherSourceServiceAgent>();
            var service = setupWeatherService(fakeServiceAgent);
            var startDate = DateTime.Today;

            // Assert
            await service.GetTemperatureData(new WeatherDataRequestEntity { StartDate = startDate, EndDate = startDate.AddDays(dayRange)});

            // Act
            A.CallTo(() => fakeServiceAgent.GetTemperatureData(A<WeatherDataRequestEntity>.Ignored)).MustHaveHappenedOnceExactly();
        }
        private WeatherService setupWeatherService(IWeatherSourceServiceAgent fakeWeatherSourceServiceAgent)
        {
            fakeWeatherSourceServiceAgent ??= fakeWeatherSourceServiceAgent ?? A.Fake<IWeatherSourceServiceAgent>();
            return new WeatherService(A.Fake<IMapper>(),fakeWeatherSourceServiceAgent);
        }
    }
}