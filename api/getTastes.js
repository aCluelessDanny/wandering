
import mongoose from './_utils/mongoose';
import UserTracks from './_models/userTracks';

const GetTastes = async ({ query }, res) => {
  try {
    await mongoose();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  const { id } = query;

  if (!id) {
    res.statusMessage = "Missing ID!";
    res.status(400).end();
  }

  UserTracks.find({ userID: id })
    .populate('trackID')
    .then(tracks => tracks.map(t => ({ ...t.trackID.features, popularity: t.trackID.popularity })))
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json(err.message))
}

export default GetTastes;
