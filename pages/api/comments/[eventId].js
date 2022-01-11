function handler(req, res) {
  const eventId = req.query.eventId;

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
      id: new Date().toISOString(),
      email,
      name,
      text,
    };
    console.log(newComment);

    res.status(201).json({ message: 'Added comment', comment: newComment });
  }

  if (req.method === 'GET') {
    const dummyList=[
      {id:'c1', name:'cc', text:'cccccc'},
      {id:'c2', name:'cc2', text:'cccccc2'},
    ]

    res.status(200).json({comments: dummyList})
  }
}

export default handler;
