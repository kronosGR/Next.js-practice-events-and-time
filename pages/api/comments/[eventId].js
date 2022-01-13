import { connectDatabase, insertDocument, getAllDocuments } from '../../../helpers/api-utils.js';

async function handler(req, res) {
  const eventId = req.query.eventId;

  try {
    const client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: 'Connecting to DB failed' });
    return;
  }

  if (req.method === 'POST') {
    // add server side validation
    const { email, name, text } = req.body;

    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(402).json({ message: 'Invalid Input!' });
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    let result;
    try {
      result = insertDocument(client, 'comments', newComment);
      newComment._id = result.insertedId;

      res.status(201).json({ message: 'Added comment', comment: newComment });
    } catch (error) {
      res.status(422).json({ message: 'Inserting comment failed' });
      client.close();
      return;
    }
  }

  if (req.method === 'GET') {
    let documents;

    try {
      documents = await getAllDocuments(client, 'comments', { _id: -1 });
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: 'Getting comments failed' });
      return;
    }
  }

  client.close();
}

export default handler;
