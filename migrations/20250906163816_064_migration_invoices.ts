import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['active', 'inactive', 'draft'];
  await knex.schema.createTable('invoices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').notNullable();
    table.string('base_currency', 3).notNullable().defaultTo('IDR');
    table.string('exchange_currency', 3).notNullable().defaultTo('IDR');
    table.decimal('exchange_value', 15, 2).notNullable().defaultTo(0);
    table.string('code_number', 255).notNullable();
    table.uuid('contact_id').notNullable();
    table.date('invoice_date').notNullable();
    table.date('due_date').notNullable();
    table.text('description').notNullable();
    table.json('data').nullable();
    table.enum('status', statuses).notNullable().defaultTo('draft');
    table.boolean('is_template').notNullable().defaultTo(false);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('project_id');
    table.index('contact_id');
    table.index('status');
    table.index('invoice_date');
    table.index('due_date');
    table.index('code_number');
    table.index('is_template');

    // Create foreign key constraints
    table.foreign('project_id', 'invoices_project_id_foreign')
      .references('id')
      .inTable('projects')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('contact_id', 'invoices_contact_id_foreign')
      .references('id')
      .inTable('contacts')
      .onDelete('RESTRICT')
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
    CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('invoices');
}
