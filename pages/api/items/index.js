import dbConnect from '../../../utils/dbConnect';
import Item from '../../../models/Item';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const items = await Item.find({});
        res.status(200).json({ success: true, data: items });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
        try {
            const { name, description } = req.body;

            // Validate input data
            if (!name || !description) {
                return res.status(400).json({ message: 'Name and description are required' });
            }
            // Create new item
            const item = new Item({ name, description });
            await item.save();
            res.status(201).json({ data: item });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
