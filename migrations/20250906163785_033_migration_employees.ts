import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const GENDERS = ['male', 'female', 'other'];
  const MARITAL_STATUSES = ['single', 'married', 'widowed', 'divorced', 'separated'];
  const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'other'];
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
    table.enum('gender', GENDERS).notNullable().defaultTo('male');
    table.enum('martial_status', MARITAL_STATUSES).notNullable().defaultTo('single');
    table.enum('blood_type', BLOOD_TYPES).nullable();
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
