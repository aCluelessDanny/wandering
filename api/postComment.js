

import mongoose from './_utils/mongoose';
import Comments from './_models/comments';

const PostComment = async ({ body = {} }, res) => {
  try {
    await mongoose();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  if (!body) {
    res.statusMessage = "Missing body!"
    return res.status(400).end();
  }

  const { userID, trackID, ...rest } = body;

  if (!userID || !trackID) {
    res.statusMessage = "Missing user or track ID!";
    return res.status(400).end();
  }

  Comments.findOneAndUpdate({ userID, trackID }, { ...rest }, { upsert: true, new: true })
    .then(data => res.status(201).json(data))
    .catch(err => res.status(500).json(err.message))
}

export default PostComment;
