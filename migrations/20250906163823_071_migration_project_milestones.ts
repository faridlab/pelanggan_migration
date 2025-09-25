import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const statuses = ['incomplete', 'complete', 'on-hold', 'canceled', 'in-progress', 'backlog', 'task', 'ready-to-test', 'blocked'];
  return knex.schema.createTable('project_milestones', (table) => {
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
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
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
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('project_milestones');
}
