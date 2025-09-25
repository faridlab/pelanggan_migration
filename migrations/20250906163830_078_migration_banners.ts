import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('banners', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table.string('status', 255).notNullable().defaultTo('inactive');
    table.string('type', 255).notNullable().defaultTo('banner');
    table.string('video_url', 512).nullable();
    table.string('link', 1024).nullable();
    table.integer('order').notNullable().defaultTo(0);
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false }).nullable();

    // Create indexes
    table.index('status');
    table.index('type');
    table.index('created_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('banners');
}
