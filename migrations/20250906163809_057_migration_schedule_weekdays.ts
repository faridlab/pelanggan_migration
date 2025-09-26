import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const weekdays = ['weekend', 'weekday'];
  await knex.schema.createTable('schedule_weekdays', (table) => {
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
    CREATE TRIGGER update_schedule_updated_at
    BEFORE UPDATE ON schedule
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_schedule_updated_at ON schedule;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('schedule');
}
