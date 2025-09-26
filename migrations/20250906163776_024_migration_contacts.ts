import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contacts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('company', 255).nullable();
    table.date('bod').nullable();
    table.string('prefix', 255).nullable();
    table.string('phonetic_first_name', 255).nullable();
    table.string('pronunciation_first_name', 255).nullable();
    table.string('middle_name', 255).nullable();
    table.string('phonetic_middle_name', 255).nullable();
    table.string('phonetic_last_name', 255).nullable();
    table.string('pronunciation_last_name', 255).nullable();
    table.string('maiden_name', 255).nullable();
    table.string('suffix', 255).nullable();
    table.string('nickname', 255).nullable();
    table.string('job_title', 255).nullable();
    table.string('department', 255).nullable();
    table.string('phonetic_company_name', 255).nullable();
    table.text('note').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });
    table.uuid('group_id').nullable();

    // Create indexes
    table.index('first_name');
    table.index('last_name');
    table.index('company');
    table.index('group_id');
    table.index('is_primary');

    // Create foreign key constraint
    table.foreign('group_id', 'contacts_group_id_foreign')
      .references('id')
      .inTable('contact_groups')
      .onDelete('SET NULL')
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
    CREATE TRIGGER update_contacts_updated_at
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('contacts');
}
