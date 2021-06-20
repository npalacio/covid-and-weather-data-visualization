using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Core.Profiles
{
    public class TemperatureDataProfile : Profile
    {
        public TemperatureDataProfile()
        {
            CreateMap<TemperatureDataEntity, TemperatureData>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Timestamp))
                .ForMember(dest => dest.TemperatureAverage, opt => opt.MapFrom(src => src.TempAvg));
        }
    }
}