import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('timeoff_employees', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.uuid('timeoff_id').notNullable();
    table.uuid('employee_id').notNullable();
    table.date('date_start').notNullable();
    table.date('date_end').notNullable();
    table.text('note').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('organization_id');
    table.index('timeoff_id');
    table.index('employee_id');

    // Create foreign key constraints
    table.foreign('organization_id', 'timeoff_employees_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('timeoff_id', 'timeoff_employees_timeoff_id_foreign')
      .references('id')
      .inTable('timeoffs')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('employee_id', 'timeoff_employees_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraint for date validation
    table.check('?? <= ??', ['date_start', 'date_end']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('timeoff_employees');
}
