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

namespace CovidAndWeatherVisualization.UnitTests
{
    public class CovidServiceTests
    {
        [TestCase(1)]
        [TestCase(2)]
        [TestCase(5)]
        public async Task GetCovidDataByCounty_WithGapsInDateRange_ReturnsWithNoGaps(int endDateOffset)
        {
            // Arrange
            var startDate = DateTime.Today.Date;
            var endDate = startDate.AddDays(endDateOffset);
            var dataWithGaps = new List<CovidDataByCountyEntity>
            {
                new CovidDataByCountyEntity
                {
                    Date = startDate
                },
                new CovidDataByCountyEntity
                {
                    Date = endDate
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.Ignored)).Returns(dataWithGaps);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity { StartDate = startDate, EndDate = endDate});

            // Act
            Assert.AreEqual(endDateOffset + 1, result.Count);
        }

        [Test]
        public async Task GetCovidDataByCounty_WithSingleGapInDateRange_ReturnsWithGapFilledCorrectly()
        {
            // Arrange
            var startDate = DateTime.Today.Date;
            var endDate = startDate.AddDays(2);
            var dataWithGaps = new List<CovidDataByCountyEntity>
            {
                new CovidDataByCountyEntity
                {
                    Date = startDate
                },
                new CovidDataByCountyEntity
                {
                    Date = endDate
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.Ignored)).Returns(dataWithGaps);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity {StartDate = startDate, EndDate = endDate});

            // Act
            Assert.AreEqual(0, result.First(_ => _.Date == startDate.AddDays(1)).CasesNew);
        }

        [Test]
        public async Task GetCovidDataByCounty_WithMultipleGapsInDateRange_ReturnsWithGapsFilledCorrectly()
        {
            // Arrange
            var gapSize = 8;
            var startDate = DateTime.Today.Date;
            var endDate = startDate.AddDays(gapSize);
            var unchangedCaseCount = 2;
            var dataWithGaps = new List<CovidDataByCountyEntity>
            {
                new CovidDataByCountyEntity
                {
                    Date = startDate,
                    CasesCumulative = unchangedCaseCount
                },
                new CovidDataByCountyEntity
                {
                    Date = endDate,
                    CasesCumulative = unchangedCaseCount
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.Ignored)).Returns(dataWithGaps);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity {StartDate = DateTime.Today, EndDate = endDate});

            // Act
            Assert.AreEqual(gapSize + 1, result.Count);
            Assert.IsTrue(result.All(_ => _.CasesNew == 0));
        }


        [Test]
        public async Task GetCovidDataByCounty_WithNoDataFound_ReturnsEmptyList()
        {
            // Arrange
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.Ignored)).Returns(new List<CovidDataByCountyEntity>());
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity {StartDate = DateTime.Today});

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
            var startDate = DateTime.Today.Date;
            var endDate = startDate.AddDays(1);
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.Ignored)).Returns(new List<CovidDataByCountyEntity>
            {
                new CovidDataByCountyEntity
                {
                    Date = startDate,
                    CasesCumulative = caseCount
                },
                new CovidDataByCountyEntity
                {
                    Date = endDate,
                    CasesCumulative = caseCount + caseCountIncrease
                }
            });
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity {StartDate = startDate, EndDate = endDate});

            // Act
            Assert.AreEqual(caseCountIncrease, result.First(_ => _.Date == endDate).CasesNew);
        }

        [Test]
        public async Task GetCovidDataByCounty_WithStartDatePassedIn_CallsDbWithOneDayBefore()
        {
            // Arrange
            var startDate = DateTime.Today;
            var fakeContext = A.Fake<CapstoneDbContext>();
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity { StartDate = startDate });

            // Act
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.That.Matches(_ => _.StartDate == startDate.AddDays(-1)))).MustHaveHappenedOnceExactly();
        }

        [Test]
        public async Task GetCovidDataByCounty_WithDataMissingForStartDate_ReturnsRecordsForStartDate()
        {
            // Arrange
            var startDate = DateTime.Today.Date;
            var endDate = startDate.AddDays(2).Date;
            var dataWithoutStartDate = new List<CovidDataByCountyEntity>
            {
                new CovidDataByCountyEntity
                {
                    Date = startDate.AddDays(1)
                },
                new CovidDataByCountyEntity
                {
                    Date = endDate
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.Ignored)).Returns(dataWithoutStartDate);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity { StartDate = startDate, EndDate = endDate });

            // Act
            Assert.AreEqual(3, result.Count);
            Assert.IsTrue(result.Any(_ => _.Date == startDate));
        }

        [Test]
        public async Task GetCovidDataByCounty_WithDataMissingForStartDate_StartsPopulatingOnceItGetsData()
        {
            // Arrange
            var startDate = DateTime.Today.Date;
            var endDate = startDate.AddDays(2).Date;
            var dataWithoutStartDate = new List<CovidDataByCountyEntity>
            {
                new CovidDataByCountyEntity
                {
                    Date = startDate.AddDays(1),
                    CasesCumulative = 1
                },
                new CovidDataByCountyEntity
                {
                    Date = endDate,
                    CasesCumulative = 2
                }
            };
            var fakeContext = A.Fake<CapstoneDbContext>();
            A.CallTo(() => fakeContext.GetCovidDataByCountyOrdered(A<CovidDataRequestEntity>.Ignored)).Returns(dataWithoutStartDate);
            var covidService = setupCovidService(fakeContext);

            // Assert
            var result = await covidService.GetCovidDataByCounty(new CovidDataRequestEntity { StartDate = startDate, EndDate = endDate});

            // Act
            Assert.AreEqual(1, result.First(_ => _.Date == endDate).CasesNew);
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