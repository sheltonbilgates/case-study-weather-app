import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "apexcharts";
// import Footbar from "./Footbar";

const Usercentric = ({ city, position }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dataChart, setDataChart] = useState([]);
  const [chart, setChart] = useState(false);
  const [notification, setNotification] = useState(false)

  // console.log(city.latitude, city.longitude, );
  // console.log("pos", position.latitude, position.longitude);
  // c
  useEffect(() => {
    const fetchAPI = () => {
      if (chart) {
        if (position) {
          const apiURL = `https://climate-api.open-meteo.com/v1/climate?latitude=${position.latitude}&longitude=${position.longitude}&start_date=${startDate}&end_date=${endDate}&models=MRI_AGCM3_2_S&daily=temperature_2m_max`;

          axios.get(apiURL).then((response) => {
            const dailyData = response.data.daily;

            const dataTable = {
              date: dailyData.time,
              temperature: dailyData.temperature_2m_max.map((temp) =>
                parseFloat(temp)
              ),
            };

            setDataChart([dataTable]);
          });
        } else if (city) {
          const api = `https://climate-api.open-meteo.com/v1/climate?latitude=${city.latitude}&longitude=${city.longitude}&start_date=${startDate}&end_date=${endDate}&models=MRI_AGCM3_2_S&daily=temperature_2m_max`;

          axios.get(api).then((res) => {
            const dailyData = res.data.daily;

            const dataTable = {
              date: dailyData.time,
              temperature: dailyData.temperature_2m_max.map((temp) =>
                parseFloat(temp)
              ),
            };

            setDataChart([dataTable]);
          });
        }
      }
    };

    fetchAPI();
  }, [city, position, endDate, startDate, chart]);

  // console.log(startDate, endDate);
  let today = new Date();
  const formattedDate = today.toLocaleDateString("en-CA");
  // console.log(formattedDate);

  const getStartDate = (e) => {
    if (e.target.value >= formattedDate) {
      setStartDate(e.target.value);
    } else {
      alert("Enter Valid Date");
    }
  };

  const getEndDate = (e) => {
    if (e.target.value <= "2050-12-31") {
      setEndDate(e.target.value);
    } else {
      alert("Enter Date between 2050 Dcember");
    }
  };
  const handleResult = (e) => {
    e.preventDefault();
    setChart(true);
  };

  const chartData = {
    options: {
      xaxis: {
        type: "datetime",
        labels: {
          format: "MMM DD",
        },
      },
      yaxis: {
        title: {
          text: "Temperature (°C)",
        },
      },
    },
    series: [
      {
        name: "Max Temperature (°C)",
        data:
          dataChart.length > 0
            ? dataChart[0].temperature.map((temp, index) => ({
                x: new Date(dataChart[0].date[index]).getTime(),
                y: temp,
              }))
            : [],
      },
    ],
  };

  const handleSubmit = (e) =>{
    e.preventDefault()
    setNotification(true)
  }
  return (
    <div className="h-screen  dark:bg-[#272635]  bg-[#E8E9F3">
      <div className=" h-96 rounded-2xl mt-4 mr-8 ml-8 shadow-2xl dark:text-white text-black border grid grid-cols-3 gap-4 flex-wrap" >
        <div className="col-span-2 p-2">
          <h1>Future Forecast</h1>
          <div className="flex flex-row ">
            <div className="flex flex-col w-48 p-2">
              <label className="p-2 " htmlFor="start">
                Enter Start date:
              </label>
              <input
                className="p-1 dark: text-black rounded-xl"
                type="date"
                name=""
                id="start"
                onChange={(e) => getStartDate(e)}
                required
              />
              <label className="p-2" htmlFor="end">
                Enter End date:
              </label>
              <input
                className="p-1 dark: text-black rounded-xl"
                type="date"
                name=""
                id="end"
                onChange={(e) => getEndDate(e)}
                required
              />
              <button
                className="mt-2 w-20 rounded bg-[#B1E5F2] text-black pl-2 pr-2"
                onClick={(e) => handleResult(e)}
              >
                Results
              </button>
            </div>
            <div className="w-full dark: text-black">
              <ReactApexChart
                options={chartData.options}
                series={chartData.series}
                type="line"
                height={350}
              />
            </div>
          </div>
        </div>
        <div className="p-2">
            <p>For alerts regarding weather in your city</p>
            <form action="" className="pt-4 flex flex-col" onSubmit={(e)=>handleSubmit(e)}>
                <label htmlFor="name">Name: </label>
                <input className="rounded-xl  dark: text-black pl-2" placeholder="Enter your name" id="name" type="text" required/>
                <br />
                <label htmlFor="email">Email  :  </label>
                <input className="rounded-xl  dark: text-black pl-2" placeholder="Enter your email" id="email" type="email" required/>
                <br />
                <label htmlFor="phone">Phone: </label>
                <input className="rounded-xl  dark: text-black pl-2" placeholder="Enter your phone number" id="phone" type="number" required/>
                <button type="submit " className="bg-red-500 mt-4 pt-1 rounded-xl pb-1">Submit</button>
                {
                    notification ? (
                        <p className="text-center pt-4 font-bold tracking-wider">Submitted Sucessfully</p>
                    ) : (
                        <p></p>
                    )
                }
            </form>
        </div>
      </div>
      {/* <Footbar /> */}
    </div>
  );
};

export default Usercentric;
