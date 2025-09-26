import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['pending', 'approved', 'rejected'];
  await knex.schema.createTable('timesheet_approvals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.uuid('approver_id');
    table.integer('year').notNullable();
    table.specificType('month', 'SMALLINT').notNullable();
    table.text('remark').notNullable();
    table.specificType('billable_time', 'TIME(0)').notNullable();
    table.float('billable_cost').notNullable();
    table.enum('status', statuses).notNullable().defaultTo('pending');
    table.json('data');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('approver_id');
    table.index('year');
    table.index('month');
    table.index('status');

    // Create foreign key constraints
    table.foreign('employee_id', 'timesheet_approvals_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('approver_id', 'timesheet_approvals_approver_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraints
    table.check('?? >= 1 AND ?? <= 12', ['month', 'month']);
    table.check('?? >= 1900', ['year']);
    table.check('?? IN (?, ?, ?)', ['status', 'pending', 'approved', 'rejected']);
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
    CREATE TRIGGER update_timesheet_updated_at
    BEFORE UPDATE ON timesheet
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_timesheet_updated_at ON timesheet;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('timesheet');
}
