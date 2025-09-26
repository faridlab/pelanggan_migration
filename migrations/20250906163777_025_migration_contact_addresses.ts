import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const TYPES = ['school', 'work', 'home', 'other'];
  await knex.schema.createTable('contact_addresses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable();
    table.enum('type', TYPES).notNullable().defaultTo('home');
    table.string('type_other', 255).nullable();
    table.string('country', 255).nullable();
    table.string('province', 255).nullable();
    table.string('city', 255).nullable();
    table.string('address', 512).notNullable();
    table.string('address2', 512).nullable();
    table.string('postalcode', 5).nullable();
    table.float('latitude').nullable();
    table.float('longitude').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('contact_id');
    table.index('type');
    table.index('country');
    table.index('province');
    table.index('city');

    // Create foreign key constraint
    table.foreign('contact_id', 'contact_addresses_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
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
    CREATE TRIGGER update_contact_addresses_updated_at
    BEFORE UPDATE ON contact_addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_contact_addresses_updated_at ON contact_addresses;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('contact_addresses');
}
