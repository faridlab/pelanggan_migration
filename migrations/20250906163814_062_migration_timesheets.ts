import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const types = ['work', 'overtime', 'break', 'leave'];
  await knex.schema.createTable('timesheets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.integer('year').notNullable();
    table.specificType('month', 'SMALLINT').notNullable();
    table.date('date').notNullable();
    table.string('remark', 255);
    table.date('time').notNullable();
    table.date('time_start');
    table.date('time_end');
    table.enum('type', types).notNullable().defaultTo('work');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('year');
    table.index('month');
    table.index('date');
    table.index('type');

    // Create foreign key constraints
    table.foreign('employee_id', 'timesheets_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraints
    table.check('?? >= 1 AND ?? <= 12', ['month', 'month']);
    table.check('?? >= 1900', ['year']);
    table.check('?? IN (?, ?, ?, ?)', ['type', 'work', 'overtime', 'break', 'leave']);
  });

  // Create a function to update the updated_at column (only if it doesn't exist)
  await knex.raw(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  // Create a trigger to call the function on UPDATE for timesheets table
  await knex.raw(`
    CREATE TRIGGER update_timesheets_updated_at
    BEFORE UPDATE ON timesheets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the trigger before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_timesheets_updated_at ON timesheets;');
  await knex.schema.dropTable('timesheets');
  // Note: We don't drop the function here as it might be used by other tables
}
