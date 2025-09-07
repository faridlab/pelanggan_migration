import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('organization_structures', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.string('type', 255).notNullable().defaultTo('department');
    table.smallint('order').notNullable().defaultTo(0);
    table.string('name', 255).notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });
    table.uuid('structure_id').nullable();

    // Create indexes
    table.index('organization_id');
    table.index('structure_id');
    table.index('type');
    table.index('order');

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
