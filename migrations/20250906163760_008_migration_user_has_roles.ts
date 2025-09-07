import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_has_roles', (table) => {
    table.uuid('role_id').notNullable();
    table.uuid('user_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false });
    table.timestamp('deleted_at', { useTz: false });

    // Create composite primary key
    table.primary(['role_id', 'user_id']);

    // Create index for user_id and role_id
    table.index(['user_id', 'role_id'], 'user_has_roles_user_id_role_id_index');

    // Create foreign key constraints
    table.foreign('role_id', 'user_has_roles_role_id_foreign')
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE')
      .onUpdate('NO ACTION');

    table.foreign('user_id', 'user_has_roles_user_id_foreign')
      .references('id')
      .inTable('users')
      .onDelete('NO ACTION')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_has_roles');
}
