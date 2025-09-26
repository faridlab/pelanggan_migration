import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('project_expenses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').notNullable();
    table.uuid('category_id').nullable();
    table.string('item_name', 255).notNullable();
    table.decimal('price', 15, 2).notNullable();
    table.string('base_currency', 3).notNullable().defaultTo('USD');
    table.string('exchange_currency', 3).notNullable().defaultTo('USD');
    table.decimal('exchange_value', 15, 2).notNullable().defaultTo(0);
    table.date('purchased_date').notNullable();
    table.uuid('employee_id').notNullable();
    table.string('purchased_from', 255).notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('project_id');
    table.index('category_id');
    table.index('employee_id');
    table.index('purchased_date');

    // Create foreign key constraints
    table.foreign('project_id', 'project_expense_project_id_foreign')
      .references('id')
      .inTable('projects')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('employee_id', 'project_expenses_employee_id_foreign')
      .references('id')
      .inTable('employees')
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
    CREATE TRIGGER update_project_expenses_updated_at
    BEFORE UPDATE ON project_expenses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_project_expenses_updated_at ON project_expenses;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('project_expenses');
}
