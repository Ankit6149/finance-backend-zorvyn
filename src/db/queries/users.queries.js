const db = require("../index");

const USER_SELECT = `
  SELECT
    u.id,
    u.name,
    u.email,
    u.status,
    u.created_at,
    u.updated_at,
    r.name AS role
  FROM users u
  JOIN roles r ON r.id = u.role_id
`;

const getRoleByName = async (roleName) => {
  const result = await db.query(
    "SELECT id, name FROM roles WHERE LOWER(name) = LOWER($1)",
    [roleName],
  );
  return result.rows[0] || null;
};

const createUser = async ({ name, email, passwordHash, roleId, status }) => {
  const result = await db.query(
    `
      WITH inserted AS (
        INSERT INTO users (name, email, password_hash, role_id, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      )
      ${USER_SELECT}
      WHERE u.id = (SELECT id FROM inserted)
    `,
    [name, email, passwordHash, roleId, status],
  );

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query(
    `
      SELECT
        u.id,
        u.name,
        u.email,
        u.password_hash,
        u.status,
        u.created_at,
        u.updated_at,
        r.name AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.email = $1
    `,
    [email],
  );

  return result.rows[0] || null;
};

const getUserById = async (id) => {
  const result = await db.query(
    `
      ${USER_SELECT}
      WHERE u.id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
};

const getAllUsers = async ({ status, role, limit, offset }) => {
  const values = [];
  const conditions = [];

  if (status) {
    values.push(status);
    conditions.push(`u.status = $${values.length}`);
  }

  if (role) {
    values.push(role);
    conditions.push(`LOWER(r.name) = LOWER($${values.length})`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const usersQuery = `
    ${USER_SELECT}
    ${whereClause}
    ORDER BY u.created_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const totalQuery = `
    SELECT COUNT(*)::int AS total
    FROM users u
    JOIN roles r ON r.id = u.role_id
    ${whereClause}
  `;

  const [usersResult, totalResult] = await Promise.all([
    db.query(usersQuery, [...values, limit, offset]),
    db.query(totalQuery, values),
  ]);

  return {
    users: usersResult.rows,
    total: totalResult.rows[0].total,
  };
};

const updateUserStatus = async (id, status) => {
  const result = await db.query(
    `
      WITH updated AS (
        UPDATE users
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      )
      ${USER_SELECT}
      WHERE u.id = (SELECT id FROM updated)
    `,
    [status, id],
  );

  return result.rows[0] || null;
};

const updateUserRole = async (id, roleId) => {
  const result = await db.query(
    `
      WITH updated AS (
        UPDATE users
        SET role_id = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING id
      )
      ${USER_SELECT}
      WHERE u.id = (SELECT id FROM updated)
    `,
    [roleId, id],
  );

  return result.rows[0] || null;
};

const deleteUser = async (id) => {
  const result = await db.query(
    "DELETE FROM users WHERE id = $1 RETURNING id, email",
    [id],
  );
  return result.rows[0] || null;
};

module.exports = {
  getRoleByName,
  createUser,
  getUserByEmail,
  getUserById,
  getAllUsers,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};
