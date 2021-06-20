using AutoMapper;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Core.Profiles
{
    public class WeatherDataRequestProfile : Profile
    {
        public WeatherDataRequestProfile()
        {
            CreateMap<WeatherDataRequest, WeatherDataRequestEntity>();
        }
    }
}