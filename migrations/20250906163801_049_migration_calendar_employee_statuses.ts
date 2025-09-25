import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const employment_statuses = ['permanent', 'contract', 'probation', 'assosiate', 'intern', 'part-time', 'promoted', 'all'];
  return knex.schema.createTable('calendar_employee_statuses', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('calendar_id').notNullable();
    table.enum('employment_status', employment_statuses).notNullable().defaultTo('permanent');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('calendar_id');
    table.index('employment_status');
    table.index(['calendar_id', 'employment_status']);

    // Create foreign key constraint
    table.foreign('calendar_id', 'calendar_employee_statuses_calendar_id_foreign')
      .references('id')
      .inTable('calendars')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('calendar_employee_statuses');
}
