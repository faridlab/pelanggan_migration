import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('foreign_table', 255).nullable();
    table.string('foreign_id', 255).nullable();
    table.string('scope', 255).nullable();
    table.text('comment').notNullable();
    table.uuid('created_by').notNullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false }).nullable();
    table.uuid('comment_id').nullable();

    // Create indexes
    table.index('foreign_table');
    table.index('foreign_id');
    table.index('scope');
    table.index('created_by');
    table.index('comment_id');

    // Create foreign key constraints
    table.foreign('comment_id', 'comments_comment_id_foreign')
      .references('id')
      .inTable('comments')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('comments');
}
