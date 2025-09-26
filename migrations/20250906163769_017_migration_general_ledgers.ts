import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('general_ledgers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('account').notNullable();
    table.timestamp('posting_date', { useTz: false }).notNullable();
    table.string('description').nullable();
    table.decimal('debit', 15, 2).notNullable().defaultTo(0);
    table.decimal('credit', 15, 2).notNullable().defaultTo(0);
    table.uuid('journal').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('account');
    table.index('posting_date');
    table.index('journal');

    // Create foreign key constraints
    table.foreign('account', 'general_ledgers_account_foreign')
      .references('id')
      .inTable('accounts')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('journal', 'general_ledgers_journal_foreign')
      .references('id')
      .inTable('journals')
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
    CREATE TRIGGER update_general_ledgers_updated_at
    BEFORE UPDATE ON general_ledgers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_general_ledgers_updated_at ON general;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('general');
}
