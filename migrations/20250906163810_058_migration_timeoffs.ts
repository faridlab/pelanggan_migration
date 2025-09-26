import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const types = ['paid', 'unpaid'];
  await knex.schema.createTable('timeoffs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('organization_id').notNullable();
    table.string('name', 255).notNullable();
    table.enum('type', types).notNullable().defaultTo('paid');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('organization_id');

    // Create foreign key constraint
    table.foreign('organization_id', 'timeoffs_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    // Add check constraint for type values
    table.check('?? IN (?, ?)', ['type', 'paid', 'unpaid']);
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
    CREATE TRIGGER update_timeoffs_updated_at
    BEFORE UPDATE ON timeoffs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_timeoffs_updated_at ON timeoffs;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('timeoffs');
}
