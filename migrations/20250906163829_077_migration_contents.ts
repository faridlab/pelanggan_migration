import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('contents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title', 1024).notNullable();
    table.string('slug', 1024).nullable();
    table.string('category', 1024).nullable();
    table.text('content').notNullable();
    table.string('type', 1024).nullable().defaultTo('post').comment('ex: post, page, faq, knowledge-base, article, tnc, privacy-policy, other');
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('title');
    table.index('slug');
    table.index('category');
    table.index('type');
    table.index('created_at');
    table.index('updated_at');
    table.index('deleted_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('contents');
}
