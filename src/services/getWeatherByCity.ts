import dayjs from "dayjs";

import { api } from "./api";
import { getNextDays } from "../utils/getNextDays";
import { weatherIcons, WeatherIconsKeysProps } from "../utils/weatherIcons";
import { NextDayItemProps } from "../components/NextDaysItem";

interface getWeatherByCityProps{
  latitude: number
  longitude: number
}

// with {type Props = ""} it is possible to create types and pass it as an other element type
// type WeatherIconsKeysProps = 'Clouds' | 'Rain' | 'Clear' | 'Snow'

// interface has the plus functionality to incorporate types of the same title and merge them
interface WeatherAPIResponseProps{
  list: {
    dt_txt: string
    main: {
      temp: number
      feels_like: number
      temp_min: number
      temp_max: number
      pressure: number
      sea_level: number
      grnd_level: number
      humidity: number
      temp_kf: number
    }
    weather: {
      main: WeatherIconsKeysProps
      description: string
    }[]
    wind: {
      speed: number
    }
    pop: number
  }[]
}

export interface WeatherResponseProps{
  temp: number
  temp_min: number
  temp_max: number
  description: string
  details: typeof weatherIcons['Clear'];
}

export interface WeatherDetailsResponseProps{

  feels_like: number
  probability: number
  wind_speed: number
  humidity: number
  temp_kf: number

}

interface TodayProps{
  weather: WeatherResponseProps
  details: WeatherDetailsResponseProps
}

export interface getWeatherByCityResponseProps{
  today: TodayProps
  nextDays: NextDayItemProps[]
}

export async function getWeatherByCity({ latitude, longitude }: getWeatherByCityProps): Promise <getWeatherByCityResponseProps> {
  const { data } = await api.get<WeatherAPIResponseProps>(`/forecast?lat=${latitude}&lon=${longitude}`);
  const { main, weather, wind, pop } = data.list[0];

  const today: TodayProps = {
    weather: {
      temp: Math.ceil(main.temp),
      temp_min: Math.floor(main.temp_min),
      temp_max: Math.ceil(main.temp_max),
      description: weather[0].description,
      details: weatherIcons[weather[0].main],
    },
    details: {
      feels_like: Math.floor(main.feels_like),
      probability: pop * 100,
      wind_speed: wind.speed,
      humidity: main.humidity,
      temp_kf: Math.floor(main.temp_kf)
    }
  }

  const days = getNextDays();
  const daysAdded: string[] = [];
  const nextDays: NextDayItemProps[] = [];

  data.list.forEach((item) => {
    const day = dayjs(new Date(item.dt_txt)).format('DD/MM');

    if (days.includes(day) && !daysAdded.includes(day)) {
      daysAdded.push(day);

      const status = item.weather[0].main;

      const details = weatherIcons[status ?? 'Clouds'];

      nextDays.push({
        day: dayjs(new Date(item.dt_txt)).format('ddd'),
        min: Math.floor(item.main.temp_min),
        max: Math.ceil(item.main.temp_max),
        weather: item.weather[0].description,
        icon: details.icon_day
      });
    }
  });

  return { today, nextDays }
}