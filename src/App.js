import React, { useState, useEffect } from 'react';

// importing axios
import axios from 'axios';

// importing icons
import { IoMdSunny, IoMdRainy, IoMdCloudy, IoMdSnow, IoMdThunderstorm, IoMdSearch } from 'react-icons/io';
import { BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind } from 'react-icons/bs';
import { TbTemperatureCelsius } from 'react-icons/tb';
import { ImSpinner8 } from 'react-icons/im';
import { clearConfigCache } from 'prettier';

// API Key
const APIkey = '27077110b8e19ba18d453482fbc61051';

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState('Kolkata');
  const [inputValue, setInputValue] = useState('');
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {

    // If input value isn't empty
    if (inputValue !== '') {
      // setLocation
      setLocation(inputValue);
    }

    // Select Input
    const input = document.querySelector('input');

    // If input value is empty
    if (inputValue === '') {
      // Set animate to true
      setAnimate(true);
      // After 500 ms set to false
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }

    // Clear input
    input.value = '';

    // Prevent default
    e.preventDefault();
  };

  //Fetch data
  useEffect(() => {

    // Set Loading to true
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios.get(url).then((res) => {
      // Set data after 1500 ms
      setTimeout(() => {
        setData(res.data);
        // Set loading to false
        setLoading(false);
      }, 1500);
    }).catch((err) => {
      setLoading(false);
      setErrorMsg(err);
    });
  }, [location]);

  // Error Message
  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg('')
    }, 2000);
    // Clear Timer
    return () => clearTimeout(timer);
  }, [errorMsg]);

  // In case of missing data, show Loader.
  if (!data) {
    return (
      <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center'>
        <div>
          <ImSpinner8 className='text-5xl animate-spin text-white' />
        </div>
      </div>
    );
  };

  // Set icon according to weather.
  let icon;

  switch (data.weather[0].main) {
    case 'Clouds':
      icon = <IoMdCloudy />;
      break;
    case 'Haze':
      icon = <BsCloudHaze2Fill />;
      break;
    case 'Rain':
      icon = <IoMdRainy className='text-[#31cafb]' />;
      break;
    case 'Clear':
      icon = <IoMdSunny className='text-[#ffde33]' />;
      break;
    case 'Drizzle':
      icon = <BsCloudDrizzleFill className='text-[#31cafb]' />;
      break;
    case 'Snow':
      icon = <IoMdSnow className='text-[#31cafb]' />;
      break;
    case 'Thunderstorm':
      icon = <IoMdThunderstorm />;
      break;
  }

  // Date Object.
  const date = new Date();

  return (
    <div className='w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0'>

      {/* Error Message */}
      {errorMsg && (
        <div>{`${errorMsg.response.data.message}`}</div>
      )}

      {/* Form */}
      <form className={`${animate ? 'animate-shake' : 'animate-none'} h-16 bg-black/30 w-full max-w-[450px] rounded-full backdrop-blur-[32px] mb-8`}>
        <div className='h-full relative flex items-center justify-between p-2'>
          <input onChange={(e) => handleInput(e)} className='flex-1 bg-transparent outline-none placeholder:text-white text-white text-[15px] font-light pl-6 h-full' type="text" placeholder='Search by city or country' />
          <button onClick={(e) => handleSubmit(e)} className='bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex items-center justify-center transition'>
            <IoMdSearch className='text-2xl text-white' />
          </button>
        </div>
      </form>

      {/* Card */}
      <div className='w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6'>
        {loading ? (
          <div className='w-full h-full flex justify-center items-center'><ImSpinner8 className='text-white text-5xl animate-spin' /></div>
        ) : (
          <div>
            {/* Card Top */}
            <div className='flex items-center gap-x-5'>
              {/* Icon */}
              <div className='text-[87px]'>{icon}</div>
              {/* Country Name */}
              <div>
                <div className='text-2xl font-semibold'>
                  {data.name}, {data.sys.country}
                </div>
                {/* Date */}
                <div>
                  {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}
                </div>
              </div>
            </div>
            {/* Card Body */}
            <div className='my-20'>
              <div className='flex justify-center items-center'>
                {/* Temperature */}
                <div className='text-[144px] leading-none font-light'>{parseInt(data.main.temp)}</div>
                {/* Celcius Icon */}
                <div className='text-4xl'>
                  <TbTemperatureCelsius />
                </div>
              </div>
              {/* Weather description */}
              <div className='capitalize text-center'>
                {data.weather[0].description}
              </div>
            </div>
            {/* Card Bottom */}
            <div className='max-w-[378px] mx-auto flex flex-col gap-y-6'>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  {/* Icon */}
                  <div className='text-[20px]'>
                    <BsEye />
                  </div>
                  <div>
                    Visibility{' '}
                    <span className='ml-2'>{data.visibility / 1000} km</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  {/* Icon */}
                  <div className='text-[20px]'>
                    <BsThermometer />
                  </div>
                  <div className='flex'>
                    Feels like
                    <div className='ml-2 flex'>{parseInt(data.main.feels_like)}
                      <TbTemperatureCelsius />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center gap-x-2'>
                  {/* Icon */}
                  <div className='text-[20px]'>
                    <BsWater />
                  </div>
                  <div>
                    Humidity
                    <span className='ml-2'>{data.main.humidity} %</span>
                  </div>
                </div>
                <div className='flex items-center gap-x-2'>
                  {/* Icon */}
                  <div className='text-[20px]'>
                    <BsWind />
                  </div>
                  <div>Wind <span className='ml-2'>{data.wind.speed} m/s</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
