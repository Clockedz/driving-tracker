import Head from "next/head";
import Image from "next/image";
import React from "react";

export default function Home() {
	const [currentTime, setCurrentTime] = React.useState({
		time: "",
		date: "",
		total: "",
	});

	const [timeLog, setTimeLog] = React.useState({
		// stores fetched value
		_id: "",
		time_elapsed: "",
		time_end: "",
		time_start: "",
		time_total: "",
	});
	const [timeDataLog, setTimeDataLog] = React.useState({
		time_elapsed: "",
		time_end: "",
		time_start: "",
		time_total: "",
	});

	const [display, setDisplay] = React.useState("");

	const [log, setLog] = React.useState("Start");
	const isTimeDataLogComplete = () => {
		return (
			timeDataLog.time_elapsed !== "" &&
			timeDataLog.time_end !== "" &&
			timeDataLog.time_start !== "" &&
			timeDataLog.time_total !== ""
		);
	};

	React.useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch("./api/serverTime");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setCurrentTime(data);
			} catch (error) {
				console.error("Error fetching current time:", error);
			}

			try {
				const response = await fetch("./api/fetch");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setTimeLog(data[0]); // has to be indexed 0 so because data is an array
				const [hours, rest] = data[0].time_total.split("hrs");
				const [minutes, second] = rest.split("mins");
				const [seconds] = second.split("secs");

				const formattedHours = parseInt(hours).toString();
				const formattedMinutes = parseInt(minutes).toString();
				const formattedSeconds = parseInt(seconds).toString();

				const totalTime = `${formattedHours} Hours ${formattedMinutes} Minutes ${formattedSeconds} Seconds`;

				setDisplay(totalTime);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
		const intervalId = setInterval(fetchData, 1000); // update time every second
		return () => clearInterval(intervalId); // clean up interval
	}, []);

	const handleClick = async () => {
		if (log === "Start") {
			setTimeDataLog((oV) => ({...oV, time_start: currentTime.total}));
		}
		if (log === "Log") {
			setTimeDataLog({
				...timeDataLog,
				time_end: currentTime.total,
			});
		}

		setLog((oV) => (log === "Log" ? "Start" : "Log"));
	};

	if (timeDataLog.time_end && timeDataLog.time_start) {
		if (!timeDataLog.time_elapsed) {
			const timeStart = new Date(timeDataLog.time_start);
			const timeEnd = new Date(timeDataLog.time_end);
			const timeElapsed =
				(timeEnd.getTime() - timeStart.getTime()) / 1000; // in seconds

			const [hours1, rest1] = timeLog.time_total.split("hrs");
			const [minutes1, seconds1] = rest1.split("mins");

			const totalSeconds1 =
				parseInt(hours1) * 3600 +
				parseInt(minutes1) * 60 +
				parseInt(seconds1);

			const totalTimeInSec = totalSeconds1 + timeElapsed;

			const hours = Math.floor(totalTimeInSec / 3600);
			const minutes = Math.floor((totalTimeInSec % 3600) / 60);
			const seconds = Math.round(totalTimeInSec % 60);

			const totalTime = `${hours.toString().padStart(2, "0")}hrs${minutes
				.toString()
				.padStart(2, "0")}mins${seconds
				.toString()
				.padStart(2, "0")}secs`;

			setTimeDataLog((oV) => ({
				...oV,
				time_elapsed: `${timeElapsed}s`,
				time_total: totalTime,
			}));
		}
	}

	if (isTimeDataLogComplete()) {
		fetch("/api/post", {
			method: "POST",
			body: JSON.stringify(timeDataLog),
		})
			.then((response) => {
				if (response.ok) {
					setTimeDataLog({
						time_elapsed: "",
						time_end: "",
						time_start: "",
						time_total: "",
					});
				} else {
					console.error(
						"POST failed with status code " + response.status
					);
				}
				return response.json();
			})
			.then((data) => console.log(data))
			.catch((error) => console.error(error));
	}

	return (
		<div className="">
			<Head>
				<title>Track your hours!</title>
			</Head>
			<div className="p-5 px-5">
				<Image
					priority
					src="/images/sunny.jpg"
					alt=""
					height={100}
					width={100}
					className="w-50 h-50 cursor-pointer"
				></Image>
			</div>

			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center flex-col">
				<h1 className="font-lg">
					It is: {currentTime.time} on {currentTime.date}
				</h1>

				<h1 className="p-3">Total time: {display}</h1>
				<button
					onClick={handleClick}
					className="rounded-[7px] bg-black w-20 h-7 text-sm hover:shadow-xlg hover:underline"
				>
					{log}
				</button>
			</div>

			<div className="absolute w-full h-1/4 bg-grass-green bottom-0"></div>
		</div>
	);
}
