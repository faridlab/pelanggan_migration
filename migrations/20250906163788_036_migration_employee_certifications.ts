import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('employee_certifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('name', 255).notNullable();
    table.string('issuing_organization', 255).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.text('description').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('name');
    table.index('issuing_organization');

    // Create foreign key constraint
    table.foreign('employee_id', 'employee_certifications_employee_id_foreign')
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
