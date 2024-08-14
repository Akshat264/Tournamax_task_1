import dbConnect from '../../../utils/dbConnect';
import Item from '../../../models/Item';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await dbConnect();

  switch (method) {
    case 'PUT':
        try {
            const { name, description } = req.body;

            if (!name || !description) {
                return res.status(400).json({ message: 'Name and description are required' });
            }

            const item = await Item.findByIdAndUpdate(
                id,
                { name, description },
                { new: true, runValidators: true }
            );

            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }

            res.status(200).json({ data: item });
        } catch (error) {
            console.error('Update error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
      break;
    case 'DELETE':
      try {
        const deletedItem = await Item.deleteOne({ _id: id });
        if (!deletedItem) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
