import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const RELATIONSHIPS = [
    'grandfather',
    'grandmother',
    'father',
    'mother',
    'uncle',
    'aunt',
    'sibling',
    'cousin',
    'niece',
    'nephew',
    'spouse',
    'husband',
    'wife',
    'child',
    'grandchild',
    'son-in-law',
    'daughter-in-law',
    'co-parents-in-law',
    'brother-in-law',
    'sister-in-law',
    'other',
  ];

  const GENDERS = ['male', 'female', 'other'];
  await knex.schema.createTable('employee_families', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('name', 255).notNullable();
    table.enum('relationship', RELATIONSHIPS).notNullable().defaultTo('spouse');
    table.string('relationship_other', 255).nullable();
    table.string('birth_place', 255).nullable();
    table.date('birth_date').nullable();
    table.enum('gender', GENDERS).notNullable().defaultTo('male');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('employee_id');
    table.index('name');
    table.index('relationship');

    // Create foreign key constraint
    table.foreign('employee_id', 'employee_families_employee_id_foreign')
      .references('id')
      .inTable('employees')
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
    CREATE TRIGGER update_employee_families_updated_at
    BEFORE UPDATE ON employee_families
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_employee_families_updated_at ON employee_families;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('employee_families');
}
