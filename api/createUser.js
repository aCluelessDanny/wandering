
import mongoose from './_utils/mongoose';
import Users from './_models/users';

const CreateUser = async ({ body = {} }, res) => {
  try {
    await mongoose();
  } catch (err) {
    return res.status(500).json(err.message);
  }

  const { id, display_name } = body;

  if (!id || !display_name) {
    res.statusMessage = "Missing body fields!"
    return res.status(400).end();
  }

  Users.updateOne({ id }, { name: display_name }, { upsert: true })
    .then(createdUser => {
      const { upserted } = createdUser;
      return res.status(upserted ? 201 : 202).json(createdUser);
    })
    .catch(err => res.status(500).json(err.message))
  }

export default CreateUser;
