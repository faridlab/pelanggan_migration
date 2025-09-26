import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('variant_units', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('variant_id').notNullable();
    table.string('type', 255).notNullable().defaultTo('custom');
    table.string('name', 255).notNullable();
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.string('status', 255).notNullable().defaultTo('active');
    table.string('label', 255).notNullable();
    table.string('label_english', 255).notNullable();
    table.string('hex', 10).nullable();
    table.string('icon', 255).nullable();
    table.float('price').notNullable();
    table.integer('stock').notNullable();
    table.string('sku', 255).nullable();
    table.float('weight').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('variant_id');
    table.index('type');
    table.index('name');
    table.index('is_primary');
    table.index('status');
    table.index('sku');

    // Create foreign key constraints
    table.foreign('variant_id', 'variant_units_variant_id_foreign')
      .references('id')
      .inTable('variants')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
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
    CREATE TRIGGER update_variant_updated_at
    BEFORE UPDATE ON variant
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_variant_updated_at ON variant;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('variant');
}
