import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('role_has_permissions', (table) => {
    table.uuid('permission_id').notNullable();
    table.uuid('role_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false });
    table.timestamp('deleted_at', { useTz: false });

    // Create composite primary key
    table.primary(['permission_id', 'role_id']);

    // Create foreign key constraints
    table.foreign('permission_id', 'role_has_permissions_permission_id_foreign')
      .references('id')
      .inTable('permissions')
      .onDelete('CASCADE')
      .onUpdate('NO ACTION');

    table.foreign('role_id', 'role_has_permissions_role_id_foreign')
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE')
      .onUpdate('NO ACTION');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('role_has_permissions');
}
