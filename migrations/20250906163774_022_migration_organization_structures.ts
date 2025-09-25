import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const TYPES = [
    'department',
    'level',
    'position'
  ];

  return knex.schema.createTable('organization_structures', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.uuid('structure_id').nullable();
    table.string('name', 255).notNullable();
    table.enum('type', TYPES).notNullable().defaultTo('department');
    table.smallint('order').notNullable().defaultTo(0);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('organization_id');
    table.index('structure_id');
    table.index('type');

    // Create foreign key constraints
    table.foreign('organization_id', 'organization_structures_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('structure_id', 'organization_structures_structure_id_foreign')
      .references('id')
      .inTable('organization_structures')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('organization_structures');
}
