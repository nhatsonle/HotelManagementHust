const db = require('./index');

const SELECT_COLUMNS = `
  rate_id, type_id, deal_name, deal_price, cancellation_policy,
  availability, start_date, end_date, discount,
  created_at, updated_at
`;

exports.getRates = async () => {
  const { rows } = await db.query(
    `SELECT ${SELECT_COLUMNS} FROM rates ORDER BY rate_id`
  );
  return rows;
};

exports.getRateById = async (id) => {
  const { rows } = await db.query(
    `SELECT ${SELECT_COLUMNS} FROM rates WHERE rate_id = $1`, [id]
  );
  return rows[0];
};

exports.createRate = async (r) => {
  const { rows } = await db.query(
    `INSERT INTO rates
      (type_id, deal_name, deal_price, cancellation_policy,
       availability, start_date, end_date, discount,
       created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8, NOW(), NOW())
     RETURNING ${SELECT_COLUMNS}`,
    [
      r.type_id, r.deal_name, r.deal_price, r.cancellation_policy,
      r.availability, r.start_date, r.end_date, r.discount
    ]
  );
  return rows[0];
};

exports.updateRate = async (id, r) => {
  const { rows } = await db.query(
    `UPDATE rates
        SET type_id            = $2,
            deal_name          = $3,
            deal_price         = $4,
            cancellation_policy= $5,
            availability       = $6,
            start_date         = $7,
            end_date           = $8,
            discount           = $9,
            updated_at         = NOW()
      WHERE rate_id = $1
      RETURNING ${SELECT_COLUMNS}`,
    [
      id, r.type_id, r.deal_name, r.deal_price, r.cancellation_policy,
      r.availability, r.start_date, r.end_date, r.discount
    ]
  );
  return rows[0];
};

exports.deleteRate = async (id) => {
  const { rowCount } = await db.query(
    `DELETE FROM rates WHERE rate_id = $1`, [id]
  );
  return rowCount > 0;
};
