import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('comments', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('scope', 255).nullable();
    table.uuid('reply_comment_id').nullable();
    table.text('comment').notNullable();
    table.uuid('created_by').nullable();
    table.uuid('updated_by').nullable();
    table.uuid('deleted_by').nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('scope');
    table.index('created_by');
    table.index('reply_comment_id');

    // Create foreign key constraints
    table.foreign('reply_comment_id', 'comments_reply_comment_id_foreign')
      .references('id')
      .inTable('comments')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('comments');
}
