import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('first_name', 255).notNullable();
    table.string('middle_name', 255).nullable();
    table.string('last_name', 255).notNullable();
    table.string('username', 255).notNullable().unique();
    table.string('email', 255).notNullable().unique();
    table.timestamp('email_verified_at', { useTz: false });
    table.string('password', 255).notNullable();
    table.date('dob').nullable();
    table.string('phone', 50).nullable();
    table.enum('gender', ['male', 'female']).nullable();
    table.enum('status', ['active', 'inactive']).notNullable().defaultTo('inactive');
    table.string('remember_token', 100).nullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    table.timestamp('deleted_at', { useTz: false });
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users');
}
