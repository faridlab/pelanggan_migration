import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('calendar_levels', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('calendar_id').notNullable();
    table.uuid('level_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('calendar_id');
    table.index('level_id');
    table.index(['calendar_id', 'level_id']);

    // Create foreign key constraints
    table.foreign('calendar_id', 'calendar_levels_calendar_id_foreign')
      .references('id')
      .inTable('calendars')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('level_id', 'calendar_levels_level_id_foreign')
      .references('id')
      .inTable('organization_structures')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('calendar_levels');
}
