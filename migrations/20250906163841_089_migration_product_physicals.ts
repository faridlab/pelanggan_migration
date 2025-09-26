import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const weight_units = ['gram', 'kg', 'mg', 'lb', 'oz'];
  const dimension_units = ['cm', 'm', 'mm', 'in', 'ft'];
  const volume_units = ['ml', 'l', 'gal', 'oz'];
  const conditions = [
    'new', 'like-new', 'used-excellent', 'used-good', 'used-fair',
    'used-poor', 'refurbished', 'open-box', 'demo', 'for-parts'
  ];

  await knex.schema.createTable('product_physicals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('product_id').notNullable();

    // Weight
    table.float('weight').notNullable();
    table.enum('weight_unit', weight_units).notNullable().defaultTo('gram');

    // Dimensions
    table.float('length').nullable();
    table.float('width').nullable();
    table.float('height').nullable();
    table.float('diameter').nullable(); // For cylindrical items
    table.enum('dimension_unit', dimension_units).notNullable().defaultTo('cm');
    table.enum('shape', ['rectangular', 'cylindrical', 'spherical', 'irregular']).nullable();

    // Volume (for liquids)
    table.float('volume').nullable();
    table.enum('volume_unit', volume_units).nullable();

    // Physical properties
    table.enum('condition', conditions).notNullable().defaultTo('new');
    table.string('color', 100).nullable();
    table.string('material', 255).nullable();
    table.string('size', 50).nullable();

    // Audit fields
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Indexes
    table.index('product_id');
    table.index('condition');
    table.index('color');
    table.index('material');

    // Foreign key
    table.foreign('product_id')
      .references('id')
      .inTable('products')
      .onDelete('CASCADE');

    // Constraints
    table.check('weight > 0', [], 'weight_positive');
    table.check('length IS NULL OR length > 0', [], 'length_positive');
    table.check('width IS NULL OR width > 0', [], 'width_positive');
    table.check('height IS NULL OR height > 0', [], 'height_positive');
    table.check('volume IS NULL OR volume > 0', [], 'volume_positive');
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
    CREATE TRIGGER update_product_updated_at
    BEFORE UPDATE ON product
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_product_updated_at ON product;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('product');
}
