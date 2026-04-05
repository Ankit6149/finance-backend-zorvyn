const db = require("../index");

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

const getSummary = async (filters) => {
  const { whereClause, values } = buildFilterClause(filters);

  const result = await db.query(
    `
      SELECT
        COALESCE(SUM(CASE WHEN fr.type = 'income' THEN fr.amount END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN fr.type = 'expense' THEN fr.amount END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN fr.type = 'income' THEN fr.amount END), 0) -
        COALESCE(SUM(CASE WHEN fr.type = 'expense' THEN fr.amount END), 0) AS net_balance
      FROM financial_records fr
      ${whereClause}
    `,
    values,
  );

  return result.rows[0];
};

const getCategoryTotals = async (filters) => {
  const { whereClause, values } = buildFilterClause(filters);

  const result = await db.query(
    `
      SELECT
        fr.type,
        fr.category,
        SUM(fr.amount) AS total
      FROM financial_records fr
      ${whereClause}
      GROUP BY fr.type, fr.category
      ORDER BY total DESC
    `,
    values,
  );

  return result.rows;
};

const getRecentActivity = async (filters, limit = 5) => {
  const { whereClause, values } = buildFilterClause(filters);
  const queryValues = [...values, limit];

  const result = await db.query(
    `
      SELECT id, user_id, amount, type, category, note, date, created_at
      FROM financial_records fr
      ${whereClause}
      ORDER BY fr.created_at DESC
      LIMIT $${queryValues.length}
    `,
    queryValues,
  );

  return result.rows;
};

const getMonthlyTrends = async (filters) => {
  const { whereClause, values } = buildFilterClause(filters);

  const result = await db.query(
    `
      SELECT
        DATE_TRUNC('month', fr.date)::date AS month,
        SUM(CASE WHEN fr.type = 'income' THEN fr.amount ELSE 0 END) AS income,
        SUM(CASE WHEN fr.type = 'expense' THEN fr.amount ELSE 0 END) AS expense
      FROM financial_records fr
      ${whereClause}
      GROUP BY month
      ORDER BY month ASC
    `,
    values,
  );

  return result.rows;
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
};
