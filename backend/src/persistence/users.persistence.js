import User from "../models/user.model.js";
import { getPagination } from "../utils/pagination.utils.js";

export async function getAllUsers(query) {
  const { page, limit, offset } = getPagination(query);

  const where = {};
  if (query?.search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${query.search}%` } },
      { email: { [Op.like]: `%${query.search}%` } },
    ];
  }
  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return { rows, count, page, limit };
}

export async function findById(id) {
  return await User.findByPk(id);
}

export async function create(userData) {
  return await User.create(userData);
}

export async function update(id, userData) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(userData);
  return user;
}

export async function remove(id) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
}

export async function findByEmail(email) {
  return await User.findOne({ where: { email } });
}

export async function findAllUsers({ limit, offset, search }) {
  const where = search ? { name: { [Op.like]: `%${search}%` } } : {};

  const { rows, count } = await User.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return { data: rows, total: count };
}
