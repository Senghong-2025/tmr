CREATE TABLE IF NOT EXISTS currencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  code text NOT NULL,
  created_on timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)
);

CREATE INDEX IF NOT EXISTS currencies_user_id_idx ON currencies(user_id);

DROP TRIGGER IF EXISTS currencies_set_updated_at ON currencies;
CREATE TRIGGER currencies_set_updated_at
BEFORE UPDATE ON currencies
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
