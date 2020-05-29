
import mongoose from './_utils/mongoose';
import Users from './_models/users';
import UserTracks from './_models/userTracks';
import Comments from './_models/comments';

const DeleteUser = async ({ query }, res) => {
  try {
    await mongoose();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  const { id: sID } = query;

  if (!sID) {
    res.statusMessage = "Missing ID!";
    return res.status(400).end();
  }

  Users.findOneAndDelete({ id: sID })
    .then(user => {
      if (!user) { return res.status(404).json(user) }
      const { _id: userID } = user;
      return UserTracks.deleteMany({ userID })
    })
    .then(_ => Comments.deleteMany({ userID: sID }))
    .then(_ => res.status(200).end())
    .catch(err => res.status(500).json(err));
}

export default DeleteUser;
