
import mongoose from './_utils/mongoose';
import Comments from './_models/comments';

const GetComment = async ({ query }, res) => {
  try {
    await mongoose();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  const { userID, trackID } = query;

  if (!userID || !trackID) {
    res.statusMessage = "Missing user or track ID!";
    return res.status(400).end();
  }

  Comments.findOne({ userID, trackID })
    .then(data => {
      if (!data) { return res.status(204).json(data) }
      return res.status(200).json(data)
    })
    .catch(err => res.status(500).json(err.message))
}

export default GetComment;
