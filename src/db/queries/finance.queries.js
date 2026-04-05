const db = require("../index");

const RECORD_SELECT = `
  SELECT
    fr.id,
    fr.user_id,
    u.name AS user_name,
    fr.amount,
    fr.type,
    fr.category,
    fr.note,
    fr.date,
    fr.created_at,
    fr.updated_at
  FROM financial_records fr
  JOIN users u ON u.id = fr.user_id
`;

const buildFilterClause = (filters = {}) => {
  const values = [];
  const conditions = [];

  if (filters.userId) {
    values.push(filters.userId);
    conditions.push(`fr.user_id = $${values.length}`);
  }

  if (filters.type) {
    values.push(filters.type);
    conditions.push(`fr.type = $${values.length}`);
  }

  if (filters.category) {
    values.push(filters.category);
    conditions.push(`fr.category = $${values.length}`);
  }

  if (filters.startDate) {
    values.push(filters.startDate);
    conditions.push(`fr.date >= $${values.length}`);
  }

  if (filters.endDate) {
    values.push(filters.endDate);
    conditions.push(`fr.date <= $${values.length}`);
  }

  return {
    whereClause: conditions.length ? `WHERE ${conditions.join(" AND ")}` : "",
    values,
  };
};

const createRecord = async ({ userId, amount, type, category, note, date }) => {
  const result = await db.query(
    `
      INSERT INTO financial_records (user_id, amount, type, category, note, date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, user_id, amount, type, category, note, date, created_at, updated_at
    `,
    [userId, amount, type, category, note, date],
  );

  return result.rows[0];
};

const getRecordById = async (id) => {
  const result = await db.query(
    `
      ${RECORD_SELECT}
      WHERE fr.id = $1
    `,
    [id],
  );

  return result.rows[0] || null;
};

const getRecords = async (filters, { limit, offset }) => {
  const { whereClause, values } = buildFilterClause(filters);

  const recordsQuery = `
    ${RECORD_SELECT}
    ${whereClause}
    ORDER BY fr.date DESC, fr.created_at DESC
    LIMIT $${values.length + 1}
    OFFSET $${values.length + 2}
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS total
    FROM financial_records fr
    ${whereClause}
  `;

  const [recordsResult, countResult] = await Promise.all([
    db.query(recordsQuery, [...values, limit, offset]),
    db.query(countQuery, values),
  ]);

  return {
    records: recordsResult.rows,
    total: countResult.rows[0].total,
  };
};

const updateRecord = async (id, payload) => {
  const fieldToColumnMap = {
    userId: "user_id",
    amount: "amount",
    type: "type",
    category: "category",
    note: "note",
    date: "date",
  };

  const fieldsToUpdate = Object.entries(payload).filter(
    ([key, value]) => fieldToColumnMap[key] && value !== undefined,
  );

  if (!fieldsToUpdate.length) {
    return getRecordById(id);
  }

  const setParts = fieldsToUpdate.map(
    ([key], index) => `${fieldToColumnMap[key]} = $${index + 1}`,
  );
  const values = fieldsToUpdate.map(([, value]) => value);

  const result = await db.query(
    `
      UPDATE financial_records
      SET ${setParts.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${values.length + 1}
      RETURNING id, user_id, amount, type, category, note, date, created_at, updated_at
    `,
    [...values, id],
  );

  return result.rows[0] || null;
};

const deleteRecord = async (id) => {
  const result = await db.query(
    "DELETE FROM financial_records WHERE id = $1 RETURNING id",
    [id],
  );
  return result.rows[0] || null;
};

module.exports = {
  createRecord,
  getRecordById,
  getRecords,
  updateRecord,
  deleteRecord,
};
