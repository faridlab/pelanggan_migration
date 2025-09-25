import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const weekdays = ['weekend', 'weekday'];
  return knex.schema.createTable('schedule_weekdays', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('schedule_id').notNullable();
    table.enum('sun', weekdays).notNullable().defaultTo('weekend');
    table.enum('mon', weekdays).notNullable().defaultTo('weekday');
    table.enum('tue', weekdays).notNullable().defaultTo('weekday');
    table.enum('wed', weekdays).notNullable().defaultTo('weekday');
    table.enum('thu', weekdays).notNullable().defaultTo('weekday');
    table.enum('fri', weekdays).notNullable().defaultTo('weekday');
    table.enum('sat', weekdays).notNullable().defaultTo('weekend');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('schedule_id');

    // Create foreign key constraint
    table.foreign('schedule_id', 'schedule_weekday_schedule_id_foreign')
      .references('id')
      .inTable('schedules')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraints for weekday values
    table.check('?? IN (?, ?)', ['sun', 'weekend', 'weekday']);
    table.check('?? IN (?, ?)', ['mon', 'weekend', 'weekday']);
    table.check('?? IN (?, ?)', ['tue', 'weekend', 'weekday']);
    table.check('?? IN (?, ?)', ['wed', 'weekend', 'weekday']);
    table.check('?? IN (?, ?)', ['thu', 'weekend', 'weekday']);
    table.check('?? IN (?, ?)', ['fri', 'weekend', 'weekday']);
    table.check('?? IN (?, ?)', ['sat', 'weekend', 'weekday']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('schedule_weekdays');
}
