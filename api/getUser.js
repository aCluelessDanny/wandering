
import mongoose from './_utils/mongoose';
import Users from './_models/users';

const GetUser = async ({ query }, res) => {
  try {
    await mongoose();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  const { id } = query;

  if (!id) {
    res.statusMessage = "Missing ID!";
    return res.status(400).end();
  }

  Users.findOne({ id })
    .then(user => {
      if (!user) { return res.status(204).json(user) }
      return res.status(200).json(user)
    })
    .catch(err => res.status(500).json(err))
}

export default GetUser;
