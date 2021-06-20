using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Core.Profiles
{
    public class CovidDataRequestProfile : Profile
    {
        public CovidDataRequestProfile()
        {
            CreateMap<CovidDataRequest, CovidDataRequestEntity>();
        }
    }
}