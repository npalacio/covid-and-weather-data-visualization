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
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest {StartDate = DateTime.Today});

            // Act
            Assert.AreEqual(2, result.Count);
            Assert.IsTrue(result.Any(_ => _.Date == DateTime.Today.Date));
        }

        [Test]
        public async Task GetCovidDataByCounty_WithSingleGapInDateRange_ReturnsWithGapFilledCorrectly()
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
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest {StartDate = DateTime.Today});

            // Act
            Assert.AreEqual(0, result.First(_ => _.Date == DateTime.Today).Cases);
        }

        [Test]
        public async Task GetCovidDataByCounty_WithMultipleGapsInDateRange_ReturnsWithGapsFilledCorrectly()
        {
            // Arrange
            var unchangedCaseCount = 2;
            var dataWithGaps = new List<CovidDataByCountyDto>
            {
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(-5).Date,
                    Cases = unchangedCaseCount
                },
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(3).Date,
                    Cases = unchangedCaseCount
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCounty(A<CovidDataRequest>.Ignored)).Returns(dataWithGaps);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest {StartDate = DateTime.Today});

            // Act
            Assert.IsTrue(result.All(_ => _.Cases == 0));
        }


        [Test]
        public async Task GetCovidDataByCounty_WithNoDataFound_ReturnsEmptyList()
        {
            // Arrange
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCounty(A<CovidDataRequest>.Ignored)).Returns(new List<CovidDataByCountyDto>());
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest {StartDate = DateTime.Today});

            // Act
            CollectionAssert.IsEmpty(result);
        }

        [TestCase(0)]
        [TestCase(1)]
        [TestCase(5)]
        public async Task GetCovidDataByCounty_WithCumulativeCasesByDayFromDb_ReturnsNewCasesByDay(int caseCountIncrease)
        {
            // Arrange
            var caseCount = 1;
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCounty(A<CovidDataRequest>.Ignored)).Returns(new List<CovidDataByCountyDto>
            {
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(-1).Date,
                    Cases = caseCount
                },
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.Date,
                    Cases = caseCount + caseCountIncrease
                }
            });
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest {StartDate = DateTime.Today});

            // Act
            Assert.AreEqual(caseCountIncrease, result.First(_ => _.Date == DateTime.Today.Date).Cases);
        }

        [Test]
        public async Task GetCovidDataByCounty_WithStartDatePassedIn_CallsDbWithStartDateMinus1()
        {
            // Arrange
            var startDate = DateTime.Today;
            var fakeContext = A.Fake<CapstoneDbContext>();
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest {StartDate = startDate});

            // Act
            A.CallTo(() => fakeContext.GetCovidDataByCounty(A<CovidDataRequest>.That.Matches(_ => _.StartDate == startDate.AddDays(-1)))).MustHaveHappenedOnceExactly();
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