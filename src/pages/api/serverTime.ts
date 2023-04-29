import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const options = {timeZone: "America/Los_Angeles"};
	const data = {
		time: new Date().toLocaleTimeString("en-US", options),
		date: new Date().toLocaleDateString("en-US", options),
		total: new Date(),
	};
	res.status(200).json(data);
}
