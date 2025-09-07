import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('employments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('employment_status', 255).notNullable();
    table.date('join_date').notNullable();
    table.date('end_join_date').nullable();
    table.uuid('organization_id').notNullable();
    table.uuid('department_id').notNullable();
    table.uuid('level_id').notNullable();
    table.uuid('position_id').notNullable();
    table.uuid('direct_manager_id').nullable();
    table.string('status', 255).notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('organization_id');
    table.index('department_id');
    table.index('level_id');
    table.index('position_id');
    table.index('direct_manager_id');
    table.index('employment_status');

    // Create foreign key constraints
    table.foreign('employee_id', 'employments_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('organization_id', 'employments_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('department_id', 'employments_department_id_foreign')
      .references('id')
      .inTable('organization_structures')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('level_id', 'employments_level_id_foreign')
      .references('id')
      .inTable('organization_structures')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('position_id', 'employments_position_id_foreign')
      .references('id')
      .inTable('organization_structures')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('employments');
}
