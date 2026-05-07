CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  amount numeric(14, 2) NOT NULL,
  currency text NOT NULL,
  type text NOT NULL CHECK (type IN ('Income', 'Outcome')),
  date text NOT NULL,
  note text NOT NULL DEFAULT '',
  created_on timestamptz NOT NULL DEFAULT now(),
  modified_on timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_user_date_idx ON transactions(user_id, date DESC);
CREATE INDEX IF NOT EXISTS transactions_user_category_idx ON transactions(user_id, category);

DROP TRIGGER IF EXISTS transactions_set_updated_at ON transactions;
CREATE TRIGGER transactions_set_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
