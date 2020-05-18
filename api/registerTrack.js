
import mongoose from './_utils/mongoose';
import Tracks from './_models/tracks';
import UserTracks from './_models/userTracks';

const registerTracks = async ({ body = {} }, res) => {
  try {
    await mongoose();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  if (!body) {
    res.statusMessage = "Missing body!";
    res.status(400).end();
  }

  const { userID, trackID, ...rest } = body;

  Tracks.findOneAndUpdate({ id: trackID }, { ...rest }, { upsert: true, new: true })
    .then(track => {
      const { _id: trackID } = track;
      return UserTracks.updateOne({ userID, trackID }, {}, { upsert: true });
    })
    .then(data => res.status(201).json(data))
    .catch(err => {
      res.statusMessage = err;
      return res.status(500).end();
    })
}

export default registerTracks;
