import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('attendance_clocks', (table) => {
    const methods = [
      'api',
      'web',
      'mobile',
      'android',
      'ios',
      'fingerprint',
      'rfc',
      'manual',
      'app',
      'rfid',
      'qrcode',
      'barcode',
      'nfc',
      'bluetooth',
      'wifi',
      'iot',
      'middleware',
      'third-party',
      'other',
    ];
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('attendance_id').notNullable();
    table.uuid('organization_id').notNullable();
    table.uuid('employee_id').notNullable();
    table.enum('method', methods).notNullable().defaultTo('api');
    table.date('date').notNullable();
    table.time('clock').notNullable();
    table.timestamp('created_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.fn.now());
    table.timestamp('deleted_at', { useTz: false });

    // Create indexes
    table.index('attendance_id');
    table.index('organization_id');
    table.index('employee_id');
    table.index('date');
    table.index(['attendance_id', 'date']);

    // Create foreign key constraints
    table.foreign('attendance_id', 'attendance_clocks_attendance_id_foreign')
      .references('id')
      .inTable('attendances')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('employee_id', 'attendance_clocks_employee_id_foreign')
      .references('id')
      .inTable('employees')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');

    table.foreign('organization_id', 'attendance_clocks_organization_id_foreign')
      .references('id')
      .inTable('organizations')
      .onDelete('RESTRICT')
      .onUpdate('CASCADE');
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
    CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the trigger and function before dropping the table
  await knex.raw('DROP TRIGGER IF EXISTS update_attendance_updated_at ON attendance;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_column;');
  await knex.schema.dropTable('attendance');
}
