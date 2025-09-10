import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('calendars', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.string('name', 255).notNullable();
    table.date('date_start').notNullable();
    table.date('date_end').notNullable();
    table.boolean('is_holiday').notNullable().defaultTo(false);
    table.boolean('is_public').notNullable().defaultTo(true);
    table.text('note').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('organization_id');
    table.index('date_start');
    table.index('date_end');
    table.index(['date_start', 'date_end']);
    table.index('is_holiday');

    // Create foreign key constraint
    table.foreign('organization_id', 'calendars_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('calendars');
}
