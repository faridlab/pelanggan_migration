import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('role_has_permissions', (table) => {
    table.uuid('permission_id').notNullable();
    table.uuid('role_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
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
    CREATE TRIGGER update_role_has_permissions_updated_at
    BEFORE UPDATE ON role_has_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_role_has_permissions_updated_at ON role;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('role_has_permissions');
}
