import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('districts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.uuid('city_id').notNullable();
    table.uuid('country_id').nullable();
    table.uuid('province_id').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create foreign key constraints
    table.foreign('city_id', 'districts_city_id_foreign')
      .references('id')
      .inTable('cities')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('country_id', 'districts_country_id_foreign')
      .references('id')
      .inTable('countries')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('province_id', 'districts_province_id_foreign')
      .references('id')
      .inTable('provinces')
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
    CREATE TRIGGER update_districts_updated_at
    BEFORE UPDATE ON districts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_districts_updated_at ON districts;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('districts');
}
