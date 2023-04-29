import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../../lib/mongodb";

export default async (req: NextApiRequest, res: NextApiResponse) => {
	try {
		const client = await clientPromise;
		const db = client.db("log");

		const {body} = req;
		console.log(body);
		const data = JSON.parse(body);
		await db.collection("time-date").insertOne(data);
		res.status(200).json({message: "Data inserted successfully"});
	} catch (e) {
		console.error(e);
		res.status(500).json({message: "Error inserting data"});
	}
};
