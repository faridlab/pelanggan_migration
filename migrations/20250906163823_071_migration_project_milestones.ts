import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['incomplete', 'complete', 'on-hold', 'canceled', 'in-progress', 'backlog', 'task', 'ready-to-test', 'blocked'];
  await knex.schema.createTable('project_milestones', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('project_id').notNullable();
    table.string('title', 255).notNullable();
    table.decimal('cost', 15, 2).notNullable().defaultTo(0);
    table.boolean('cost_to_bugdet').notNullable().defaultTo(false);
    table.text('summary').notNullable();
    table.date('start_date').notNullable();
    table.date('end_date').nullable();
    table.enum('status', statuses).notNullable().defaultTo('task');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('project_id');
    table.index('status');
    table.index('start_date');
    table.index('end_date');

    // Create foreign key constraints
    table.foreign('project_id', 'project_milestones_project_id_foreign')
      .references('id')
      .inTable('projects')
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
    CREATE TRIGGER update_project_milestones_updated_at
    BEFORE UPDATE ON project_milestones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_project_milestones_updated_at ON project_milestones;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('project_milestones');
}
