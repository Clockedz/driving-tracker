import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../../lib/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const client = await clientPromise;
		const db = client.db("log");

		const time_date = await db
			.collection("time-date")
			.find({})
			.sort({_id: -1})
			.limit(1)
			.toArray();
		res.json(time_date);
	} catch (e) {
		console.error(e);
	}
};
