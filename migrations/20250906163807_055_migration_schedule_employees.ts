import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('schedule_employees', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.uuid('employee_id').notNullable();
    table.date('schedule_date').notNullable();
    table.integer('order_number').notNullable().defaultTo(500);
    table.time('time_in').notNullable().defaultTo(knex.raw("'08:00:00'::time without time zone"));
    table.time('time_out').notNullable().defaultTo(knex.raw("'17:00:00'::time without time zone"));
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('schedule_date');
    table.index('organization_id');
    table.index('order_number');
    table.index(['employee_id', 'schedule_date']);
    table.index(['organization_id', 'schedule_date']);

    // Create foreign key constraints
    table.foreign('employee_id', 'schedule_employees_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('organization_id', 'schedule_employees_organization_id_foreign')
      .references('id')
      .inTable('organizations')
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
    CREATE TRIGGER update_schedule_updated_at
    BEFORE UPDATE ON schedule
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_schedule_updated_at ON schedule;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('schedule');
}
