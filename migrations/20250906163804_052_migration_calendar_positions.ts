import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('calendar_positions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('calendar_id').notNullable();
    table.uuid('position_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('calendar_id');
    table.index('position_id');
    table.index(['calendar_id', 'position_id']);

    // Create foreign key constraints
    table.foreign('calendar_id', 'calendar_positions_calendar_id_foreign')
      .references('id')
      .inTable('calendars')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('position_id', 'calendar_positions_position_id_foreign')
      .references('id')
      .inTable('organization_structures')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('calendar_positions');
}
