using System.Threading.Tasks;

namespace CovidDataLoad.Interfaces
{
    public interface ICovidLogic
    {
        Task RefreshCovidData();
    }
}