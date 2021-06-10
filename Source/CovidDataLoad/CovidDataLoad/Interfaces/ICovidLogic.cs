using System.Collections.Generic;
using System.Threading.Tasks;
using CovidDataLoad.Models;

namespace CovidDataLoad.Interfaces
{
    public interface ICovidLogic
    {
        Task RefreshCovidData();
    }
}