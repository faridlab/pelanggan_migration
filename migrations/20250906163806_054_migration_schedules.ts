import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('schedules', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name', 255).notNullable();
    table.boolean('is_default').notNullable().defaultTo(false);
    table.integer('order_number').notNullable().defaultTo(0);
    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.time('time_in').notNullable().defaultTo(knex.raw("'08:00:00'::time without time zone"));
    table.time('time_out').notNullable().defaultTo(knex.raw("'17:00:00'::time without time zone"));
    table.boolean('is_override_holiday').notNullable().defaultTo(false);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });
    table.uuid('organization_id').notNullable();

    // Create indexes
    table.index('organization_id');
    table.index('name');
    table.index('is_default');
    table.index('order_number');
    table.index('start_date');
    table.index('end_date');
    table.index(['start_date', 'end_date']);

    // Create foreign key constraint
    table.foreign('organization_id', 'schedules_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('schedules');
}
