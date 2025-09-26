import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tracking_orders', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('transaction_id').notNullable();
    table.uuid('status_id').notNullable();
    table.integer('order').notNullable();
    table.string('note', 255).nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('transaction_id');
    table.index('status_id');
    table.index('order');

    // Create foreign key constraints
    table.foreign('transaction_id', 'tracking_orders_transaction_id_foreign')
      .references('id')
      .inTable('transactions')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');

    table.foreign('status_id', 'tracking_orders_status_id_foreign')
      .references('id')
      .inTable('tracking_statuses')
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
    CREATE TRIGGER update_tracking_orders_updated_at
    BEFORE UPDATE ON tracking_orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_tracking_orders_updated_at ON tracking_orders;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('tracking_orders');
}
