import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('attendance_clocks', (table) => {
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
    table.timestamp('updated_at', { useTz: false }).notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
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
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('attendance_clocks');
}
