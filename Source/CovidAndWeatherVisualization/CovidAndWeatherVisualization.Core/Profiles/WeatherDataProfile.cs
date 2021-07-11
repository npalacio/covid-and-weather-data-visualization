using AutoMapper;
using CovidAndWeatherVisualization.Core.Entities;
using CovidAndWeatherVisualization.Core.Resources;

namespace CovidAndWeatherVisualization.Core.Profiles
{
    public class WeatherDataProfile : Profile
    {
        public WeatherDataProfile()
        {
            CreateMap<WeatherDataEntity, WeatherData>()
                .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Timestamp.Date))
                .ForMember(dest => dest.TemperatureAverage, opt => opt.MapFrom(src => src.TempAvg))
                .ForMember(dest => dest.HumidityRelativeAverage, opt => opt.MapFrom(src => src.RelHumAvg))
                .ForMember(dest => dest.HumiditySpecificAverage, opt => opt.MapFrom(src => src.SpcHumAvg));
        }
    }
}