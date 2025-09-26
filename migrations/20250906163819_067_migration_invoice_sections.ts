import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('invoice_sections', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('invoice_id').notNullable();
    table.string('title').notNullable();
    table.text('description').nullable();
    table.json('data').nullable();
    table.specificType('order', 'SMALLINT').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('invoice_id');
    table.index('order');

    // Create foreign key constraints
    table.foreign('invoice_id', 'invoice_sections_invoice_id_foreign')
      .references('id')
      .inTable('invoices')
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
    CREATE TRIGGER update_invoice_updated_at
    BEFORE UPDATE ON invoice
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_invoice_updated_at ON invoice;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('invoice');
}
