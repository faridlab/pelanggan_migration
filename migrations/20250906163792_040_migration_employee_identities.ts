import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const IDENTITY_TYPES = [
    'ID Card',
    'KTP',
    'SIM',
    'Passport',
    'NPWP',
    'KK',
    'Other'
  ];
  return knex.schema.createTable('employee_identities', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.enum('identity_type', IDENTITY_TYPES).notNullable().defaultTo('KTP');
    table.string('identity_number', 255).notNullable();
    table.date('identity_expiry_date').nullable();
    table.boolean('is_permanent').notNullable().defaultTo(false);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('identity_type');
    table.index('identity_number');

    // Create foreign key constraint
    table.foreign('employee_id', 'employee_identities_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('employee_identities');
}
