import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('notifications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('type', 255).notNullable();
    table.string('notifiable_type', 255).notNullable();
    table.bigInteger('notifiable_id').notNullable();
    table.string('data').notNullable();
    table.timestamp('read_at', { useTz: false });
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());

    // Create index for notifiable_type and notifiable_id
    table.index(['notifiable_type', 'notifiable_id'], 'notifications_notifiable_type_notifiable_id_index');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('notifications');
}