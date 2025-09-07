import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('employees', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('employee_number', 255).notNullable();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('email', 255).notNullable();
    table.string('mobile_phone', 255).notNullable();
    table.string('phone', 255).nullable();
    table.string('birth_place', 255).notNullable();
    table.date('birth_date').notNullable();
    table.string('gender', 255).notNullable();
    table.string('martial_status', 255).notNullable();
    table.string('blood_type', 255).nullable();
    table.uuid('religion_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_number');
    table.index('email');
    table.index('religion_id');
    table.unique('employee_number');

    // Create foreign key constraint
    table.foreign('religion_id', 'employees_religion_id_foreign')
      .references('id')
      .inTable('religions')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('employees');
}
