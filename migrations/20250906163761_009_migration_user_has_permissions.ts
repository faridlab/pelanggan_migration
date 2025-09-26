import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('user_has_permissions', (table) => {
    table.uuid('permission_id').notNullable();
    table.uuid('user_id').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create composite primary key
    table.primary(['permission_id', 'user_id']);

    // Create index for user_id and permission_id
    table.index(['user_id', 'permission_id'], 'user_has_permissions_user_id_permission_id_index');

    // Create foreign key constraints
    table.foreign('permission_id', 'model_has_permissions_permission_id_foreign')
      .references('id')
      .inTable('permissions')
      .onDelete('CASCADE')
      .onUpdate('NO ACTION');

    table.foreign('user_id', 'user_has_permissions_user_id_foreign')
      .references('id')
      .inTable('users')
      .onDelete('NO ACTION')
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
    CREATE TRIGGER update_user_has_permissions_updated_at
    BEFORE UPDATE ON user_has_permissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_user_has_permissions_updated_at ON user;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('user_has_permissions');
}
