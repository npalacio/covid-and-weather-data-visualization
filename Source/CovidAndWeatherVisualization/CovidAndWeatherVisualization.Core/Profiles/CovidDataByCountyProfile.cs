using AutoMapper;
using CovidAndWeatherVisualization.Core.Models;

namespace CovidAndWeatherVisualization.Core.Profiles
{
    public class CovidDataByCountyProfile : Profile
    {
        public CovidDataByCountyProfile()
        {
            CreateMap<CovidDataByCountyDto, CovidDataByCounty>()
                .ForMember(fac => fac.Date, opt => opt.Ignore());
        }
    }
}