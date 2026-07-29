-- Rollback for online_sale_enabled migration
-- Removes ONLY the online_sale_enabled column added to products.
-- Does not touch any other column or data.

ALTER TABLE products DROP COLUMN IF EXISTS online_sale_enabled;
