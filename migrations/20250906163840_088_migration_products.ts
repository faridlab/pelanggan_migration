import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['banned', 'pending', 'deleted', 'active', 'featured', 'inactive', 'out-of-stock'];
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('category_id').notNullable();
    table.uuid('brand_id').nullable();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('currency', 3).notNullable().defaultTo('IDR');
    table.float('price', 11, 2).notNullable();
    table.enum('status', statuses).notNullable().defaultTo('active');
    table.json('data').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Indexes
    // Essential indexes (keep these)
    table.index('name');
    table.index('category_id');
    table.index('brand_id');
    table.index('status');

    // High-value additions
    table.index('price');
    table.index('created_at');
    table.index(['category_id', 'status']); // Composite for common queries

    // Foreign key constraints
    table.foreign('brand_id', 'products_brand_id_foreign')
      .references('id')
      .inTable('brands')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('category_id', 'products_category_id_foreign')
      .references('id')
      .inTable('categories')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.check('price >= 0', [], 'products_price_positive');
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
    CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_products_updated_at ON products;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('products');
}
