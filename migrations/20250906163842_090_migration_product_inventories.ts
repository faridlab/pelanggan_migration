import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('product_inventories', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();
    table.uuid('warehouse_id').notNullable();

    // Stock quantities
    table.integer('stock_quantity').notNullable().defaultTo(0);
    table.integer('reserved_quantity').notNullable().defaultTo(0);
    table.integer('available_quantity').notNullable().defaultTo(0);

    // Inventory management
    table.integer('reorder_point').nullable();
    table.integer('max_stock').nullable();

    // Audit fields
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Indexes
    table.index(['product_id', 'warehouse_id']);

    // Foreign keys
    table.foreign('product_id').references('id').inTable('products').onDelete('CASCADE');
    table.foreign('warehouse_id').references('id').inTable('warehouses').onDelete('CASCADE');

    // Constraints
    table.check('stock_quantity >= 0', [], 'stock_quantity_positive');
    table.check('reserved_quantity >= 0', [], 'reserved_quantity_positive');
    table.check('available_quantity >= 0', [], 'available_quantity_positive');
    table.check('reserved_quantity <= stock_quantity', [], 'reserved_not_exceed_stock');
  });

  // Create a function to update the updated_at column
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create a trigger to call the function on UPDATE
  await knex.raw(`
    CREATE TRIGGER update_product_inventories_updated_at
    BEFORE UPDATE ON product_inventories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_product_inventories_updated_at ON product_inventories;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('product_inventories');
}