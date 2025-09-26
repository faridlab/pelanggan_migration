import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const TYPES = ['facebook', 'twitter', 'instagram', 'tiktok', 'github', 'gitlab', 'bitbucket', 'telegram', 'pinterest', 'linkedin', 'youtube', 'other'];
  await knex.schema.createTable('contact_socials', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('contact_id').notNullable();
    table.enum('type', TYPES).notNullable().defaultTo('facebook');
    table.string('type_other').nullable();
    table.string('url', 255).notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('contact_id');
    table.index('type');

    // Create foreign key constraint
    table.foreign('contact_id', 'contact_socials_contact_id_foreign')
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
    CREATE TRIGGER update_contact_updated_at
    BEFORE UPDATE ON contact
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_contact_updated_at ON contact;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('contact');
}
