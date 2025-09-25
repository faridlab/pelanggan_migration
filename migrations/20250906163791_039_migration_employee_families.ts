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
  return knex.schema.createTable('employee_families', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('employee_id').notNullable();
    table.string('name', 255).notNullable();
    table.enum('relationship', RELATIONSHIPS).notNullable().defaultTo('spouse');
    table.string('relationship_other', 255).nullable();
    table.string('birth_place', 255).nullable();
    table.date('birth_date').nullable();
    table.enum('gender', GENDERS).notNullable().defaultTo('male');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
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
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('employee_families');
}
