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
        public async Task GetCovidDataByCounty_WithSingleGapInDateRange_ReturnsWithGapFilledCorrectly()
        {
            // Arrange
            var caseCount = 2;
            var dataWithGaps = new List<CovidDataByCountyDto>
            {
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(-1).Date,
                    Cases = caseCount
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
            Assert.AreEqual(caseCount, result.First(_ => _.Date == DateTime.Today).Cases);
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
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest
            {
                StartDate = dataWithGaps.Min(_ => _.Date).Date,
                EndDate = dataWithGaps.Max(_ => _.Date).Date
            });

            // Act
            Assert.IsTrue(result.All(_ => _.Cases == unchangedCaseCount));
        }

        [Test]
        public async Task GetCovidDataByCounty_WithMultipleGapsInDateRange_DoesNotChangeResultsWithData()
        {
            // Arrange
            var caseCount = 2;
            var dateWithData = DateTime.Today.AddDays(3).Date;
            var dataWithGaps = new List<CovidDataByCountyDto>
            {
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(-5).Date,
                    Cases = caseCount - 1
                },
                new CovidDataByCountyDto
                {
                    Date = dateWithData,
                    Cases = caseCount
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
            Assert.AreEqual(caseCount, result.First(_ => _.Date == dateWithData).Cases);
        }

        [Test]
        public async Task GetCovidDataByCounty_WithSeparateGapsInDateRange_ReturnsWithGapsFilledCorrectly()
        {
            // Arrange
            var caseCount = 2;
            var dateWithData = DateTime.Today.AddDays(3).Date;
            var dataWithGaps = new List<CovidDataByCountyDto>
            {
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.AddDays(-3).Date,
                    Cases = caseCount - 1
                },
                new CovidDataByCountyDto
                {
                    Date = DateTime.Today.Date,
                    Cases = caseCount
                },
                new CovidDataByCountyDto
                {
                    Date = dateWithData,
                    Cases = caseCount + 1
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
            var filledGap = result.Where(_ => _.Date > DateTime.Today && _.Date < dateWithData);
            Assert.IsTrue(filledGap.All(_ => _.Cases == caseCount));
        }

        [Test]
        public async Task GetCovidDataByCounty_WithNoDataFound_ReturnsEmptyList()
        {
            // Arrange
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCounty(A<CovidDataRequest>.Ignored)).Returns(new List<CovidDataByCountyDto>());
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequest());

            // Act
            CollectionAssert.IsEmpty(result);
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