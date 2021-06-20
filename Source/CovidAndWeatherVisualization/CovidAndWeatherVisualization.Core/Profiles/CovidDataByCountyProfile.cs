using AutoMapper;
using CovidAndWeatherVisualization.Core.Models;

namespace CovidAndWeatherVisualization.Core.Profiles
{
    public class CovidDataByCountyProfile : Profile
    {
        public CovidDataByCountyProfile()
        {
            CreateMap<CovidDataByCountyDto, CovidDataByCounty>()
                .ForMember(dest => dest.Date, opt => opt.Ignore())
                .ForMember(dest => dest.Cases, opt => opt.Ignore());
        }
    }
}