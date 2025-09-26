import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('schedules', (table) => {
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
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
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
    CREATE TRIGGER update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_schedules_updated_at ON schedules;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('schedules');
}
