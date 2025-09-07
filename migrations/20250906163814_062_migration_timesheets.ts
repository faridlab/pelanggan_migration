import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('timesheets', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.integer('year').notNullable();
    table.specificType('month', 'SMALLINT').notNullable();
    table.date('date').notNullable();
    table.string('remark', 255);
    table.date('time').notNullable();
    table.date('time_start');
    table.date('time_end');
    table.string('type', 255).notNullable().defaultTo('work');
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
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('timesheets');
}
