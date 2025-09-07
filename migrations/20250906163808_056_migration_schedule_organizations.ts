import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('schedule_organizations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.uuid('structure_id').notNullable();
    table.string('type', 255).notNullable().defaultTo('department');
    table.string('name', 255).notNullable();
    table.integer('order_number').notNullable().defaultTo(100);
    table.date('start_date').notNullable();
    table.date('end_date').notNullable();
    table.time('time_in').notNullable().defaultTo(knex.raw("'08:00:00'::time without time zone"));
    table.time('time_out').notNullable().defaultTo(knex.raw("'17:00:00'::time without time zone"));
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('organization_id');
    table.index('structure_id');
    table.index('type');
    table.index('name');
    table.index('order_number');
    table.index('start_date');
    table.index('end_date');
    table.index(['start_date', 'end_date']);
    table.index(['organization_id', 'structure_id']);

    // Create foreign key constraints
    table.foreign('organization_id', 'schedule_organizations_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('structure_id', 'schedule_organizations_structure_id_foreign')
      .references('id')
      .inTable('organization_structures')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraint for type field
    table.check('?? IN (?, ?, ?)', ['type', 'department', 'branch', 'position']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('schedule_organizations');
}
