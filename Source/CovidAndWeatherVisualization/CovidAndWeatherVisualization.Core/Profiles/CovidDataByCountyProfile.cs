using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Requests;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Core.Profiles
{
    public class CovidDataByCountyProfile : Profile
    {
        public CovidDataByCountyProfile()
        {
            CreateMap<CovidDataByCountyEntity, CovidDataByCounty>()
                .ForMember(dest => dest.Date, opt => opt.Ignore())
                .ForMember(dest => dest.CasesNew, opt => opt.Ignore());
        }
    }
}