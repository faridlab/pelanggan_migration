import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['active', 'inactive', 'terminated', 'resigned', 'retired', 'other'];
  const employment_statuses = ['permanent', 'contract', 'probation', 'assosiate', 'intern', 'part-time', 'promoted', 'other'];
  await knex.schema.createTable('employments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.enum('employment_status', employment_statuses).notNullable().defaultTo('assosiate');
    table.date('join_date').notNullable();
    table.date('end_join_date').nullable();
    table.uuid('organization_id').notNullable();
    table.uuid('department_id').notNullable();
    table.uuid('level_id').notNullable();
    table.uuid('position_id').notNullable();
    table.uuid('direct_manager_id').nullable();
    table.enum('status', statuses).notNullable().defaultTo('active');
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
    CREATE TRIGGER update_employments_updated_at
    BEFORE UPDATE ON employments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_employments_updated_at ON employments;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('employments');
}
