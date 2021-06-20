using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
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