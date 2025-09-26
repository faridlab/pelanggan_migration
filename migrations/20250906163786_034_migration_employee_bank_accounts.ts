import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('employee_bank_accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.uuid('bank_id').notNullable();
    table.string('account_number', 255).notNullable();
    table.string('account_name', 255).notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('bank_id');
    table.index('account_number');

    // Create foreign key constraints
    table.foreign('employee_id', 'employee_bank_accounts_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('bank_id', 'employee_bank_accounts_bank_id_foreign')
      .references('id')
      .inTable('banks')
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
    CREATE TRIGGER update_employee_updated_at
    BEFORE UPDATE ON employee
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_employee_updated_at ON employee;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('employee');
}
