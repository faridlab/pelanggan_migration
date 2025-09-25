import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('employee_educations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('instituion_name', 255).notNullable();
    table.string('degree', 255).notNullable();
    table.string('major', 255).notNullable();
    table.string('field', 255).notNullable();
    table.float('score').nullable();
    table.integer('start_year').notNullable();
    table.integer('end_year').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('instituion_name');
    table.index('degree');

    // Create foreign key constraint
    table.foreign('employee_id', 'employee_educations_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('employee_educations');
}
