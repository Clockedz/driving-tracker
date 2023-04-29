import {NextApiRequest, NextApiResponse} from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	const data = {
		time: new Date().toLocaleTimeString(),
		date: new Date().toLocaleDateString(),
		total: new Date(),
	};
	res.status(200).json(data);
}
