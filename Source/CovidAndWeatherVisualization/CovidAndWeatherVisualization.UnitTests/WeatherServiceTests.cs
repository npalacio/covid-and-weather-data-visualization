using System;
using AutoMapper;
using CovidAndWeatherVisualization.Services;
using FakeItEasy;
using NUnit.Framework;
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
            await service.GetWeatherData(new WeatherDataRequestEntity { StartDate = startDate, EndDate = startDate.AddDays(dayRange) });

            // Act
            A.CallTo(() => fakeServiceAgent.GetWeatherData(A<WeatherDataRequestEntity>.Ignored)).MustHaveHappenedOnceExactly();
        }

        [TestCase(1)]
        [TestCase(2)]
        [TestCase(5)]
        public async Task GetTemperatureData_WithDateRangeGreaterThanAYear_CallsServiceAgentOncePerYear(int years)
        {
            // Arrange
            var fakeServiceAgent = A.Fake<IWeatherSourceServiceAgent>();
            var service = setupWeatherService(fakeServiceAgent);
            var startDate = DateTime.Today;

            // Assert
            await service.GetWeatherData(new WeatherDataRequestEntity { StartDate = startDate, EndDate = startDate.AddDays(365 * years) });

            // Act
            A.CallTo(() => fakeServiceAgent.GetWeatherData(A<WeatherDataRequestEntity>.Ignored)).MustHaveHappened(years, Times.Exactly);
        }

        [Test]
        public async Task GetTemperatureData_WithStartDateAfterEndDate_ReturnsEmptyList()
        {
            // Arrange
            var service = setupWeatherService();
            var startDate = DateTime.Today;

            // Assert
            var result = await service.GetWeatherData(new WeatherDataRequestEntity { StartDate = startDate.AddDays(1), EndDate = startDate});

            // Act
            CollectionAssert.IsEmpty(result);
        }

        private WeatherService setupWeatherService(IWeatherSourceServiceAgent fakeWeatherSourceServiceAgent = null)
        {
            fakeWeatherSourceServiceAgent ??= fakeWeatherSourceServiceAgent ?? A.Fake<IWeatherSourceServiceAgent>();
            return new WeatherService(A.Fake<IMapper>(),fakeWeatherSourceServiceAgent);
        }
    }
}