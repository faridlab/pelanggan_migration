import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['request', 'approved', 'rejected'];
  await knex.schema.createTable('timeoff_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.uuid('timeoff_id').notNullable();
    table.uuid('employee_id').notNullable();
    table.date('date_start').notNullable();
    table.date('date_end').notNullable();
    table.enum('status', statuses).notNullable().defaultTo('request');
    table.text('note').notNullable();
    table.uuid('approval_employee_id');
    table.text('note_reject');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('organization_id');
    table.index('timeoff_id');
    table.index('employee_id');
    table.index('approval_employee_id');
    table.index('status');

    // Create foreign key constraints
    table.foreign('organization_id', 'timeoff_requests_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('timeoff_id', 'timeoff_requests_timeoff_id_foreign')
      .references('id')
      .inTable('timeoffs')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('employee_id', 'timeoff_requests_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('approval_employee_id', 'timeoff_requests_approval_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraints
    table.check('?? <= ??', ['date_start', 'date_end']);
    table.check('?? IN (?, ?, ?)', ['status', 'request', 'approved', 'rejected']);
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
    CREATE TRIGGER update_timeoff_updated_at
    BEFORE UPDATE ON timeoff
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_timeoff_updated_at ON timeoff;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('timeoff');
}
