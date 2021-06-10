using System.Collections.Generic;
using System.Threading.Tasks;
using CovidDataLoad.Models;

namespace CovidDataLoad.Interfaces
{
    public interface ICovidRepository
    {
        Task GetCovidCumulativeDataByCounty();
        void SaveCovidCumulativeDataByCounty(List<CovidCumulativeByCounty> covidData);
    }
}