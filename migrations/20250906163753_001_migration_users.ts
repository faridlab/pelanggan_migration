import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
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
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });
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
    CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
  // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_users_updated_at ON users;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('users');
}
