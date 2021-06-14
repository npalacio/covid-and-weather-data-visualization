using System;
using AutoMapper;
using CovidAndWeatherVisualization.Core.Models;
using CovidAndWeatherVisualization.Core.Profiles;
using CovidAndWeatherVisualization.DataAccess;
using CovidAndWeatherVisualization.Services;
using FakeItEasy;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CovidAndWeatherVisualization.UnitTests
{
    public class CovidServiceTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        public async Task GetCovidDataByCounty_WithGapsInDateRange_ReturnsWithNoGaps()
        {
            // Arrange
            var dataWithGaps = new List<CovidDataByCountyDto>
            {
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(-1).Date
                },
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(1).Date
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCounty(A<CovidDataRequest>.Ignored)).Returns(dataWithGaps);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest
                {
                    StartDate = dataWithGaps.Min(_ => _.Date).Date,
                    EndDate = dataWithGaps.Max(_ => _.Date).Date
                });

            // Act
            Assert.AreEqual(3, result.Count);
            Assert.IsTrue(result.Any(_ => _.Date == DateTime.Today.Date));
        }

        [Test]
        public async Task GetCovidDataByCounty_WithGapsInDateRange_ReturnsWithGapsFilledCorrectly()
        {
            // Arrange
            var dataWithGaps = new List<CovidDataByCountyDto>
            {
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(-1).Date,
                    Cases = 2
                },
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(1).Date
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCounty(A<CovidDataRequest>.Ignored)).Returns(dataWithGaps);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest
            {
                StartDate = dataWithGaps.Min(_ => _.Date).Date,
                EndDate = dataWithGaps.Max(_ => _.Date).Date
            });

            // Act
            Assert.AreEqual(2, result.First(_ => _.Date == DateTime.Today).Cases);
        }

        private CovidService setupCovidService(CapstoneDbContext fakeContext)
        {
            var configuration = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<CovidDataByCountyProfile>();
            });
            var mapper = new Mapper(configuration);
            return new CovidService(fakeContext, mapper);
        }
    }
}