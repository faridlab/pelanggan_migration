import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const STATUS = ['active', 'inactive'];
  await knex.schema.createTable('showcases', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.string('short_desc', 500).nullable();
    table.text('desc').nullable();
    table.enum('status', STATUS).notNullable().defaultTo('active');
    table.integer('order').nullable().defaultTo(0);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('name');
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
    CREATE TRIGGER update_showcases_updated_at
    BEFORE UPDATE ON showcases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_showcases_updated_at ON showcases;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('showcases');
}
