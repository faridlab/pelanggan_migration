import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('employee_taxes', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('npwp_number', 255).notNullable();
    table.string('ptkp_status', 255).notNullable();
    table.string('tax_method', 255).notNullable();
    table.string('tax_salary', 255).notNullable();
    table.date('taxable_date').notNullable();
    table.string('tax_status', 255).notNullable();
    table.integer('beginning_netto').nullable();
    table.integer('pph21_paid').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('npwp_number');
    table.index('tax_status');

    // Create foreign key constraint
    table.foreign('employee_id', 'employee_taxes_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('employee_taxes');
}
