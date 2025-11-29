const { sequelize } = require('../config/database');

const User = require('./User');
const Patient = require('./Patient');
const Doctor = require('./Doctor');
const Department = require('./Department');
const Appointment = require('./Appointment');
const Prescription = require('./Prescription');
const LabTest = require('./LabTest');
const Bill = require('./Bill');

// New BCNF-normalized models
const DoctorSchedule = require('./DoctorSchedule');
const Medicine = require('./Medicine');
const PrescriptionMedicine = require('./PrescriptionMedicine');
const LabTestCatalog = require('./LabTestCatalog');

// ====================
// ASSOCIATIONS
// ====================

// User -> Patient/Doctor
User.hasOne(Patient, { foreignKey: 'userId', onDelete: 'CASCADE' });
Patient.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(Doctor, { foreignKey: 'userId', onDelete: 'CASCADE' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

// Department -> Doctor
Department.hasMany(Doctor, { foreignKey: 'departmentId' });
Doctor.belongsTo(Department, { foreignKey: 'departmentId' });

// Doctor -> DoctorSchedule (1:N)
Doctor.hasMany(DoctorSchedule, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
DoctorSchedule.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Appointment Relationships
Patient.hasMany(Appointment, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Prescription Relationships
Appointment.hasOne(Prescription, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointmentId' });

// Prescription -> Medicines (M:N through PrescriptionMedicine)
Prescription.belongsToMany(Medicine, {
    through: PrescriptionMedicine,
    foreignKey: 'prescriptionId',
    otherKey: 'medicineId'
});
Medicine.belongsToMany(Prescription, {
    through: PrescriptionMedicine,
    foreignKey: 'medicineId',
    otherKey: 'prescriptionId'
});

// Direct access to junction table
Prescription.hasMany(PrescriptionMedicine, { foreignKey: 'prescriptionId', onDelete: 'CASCADE' });
PrescriptionMedicine.belongsTo(Prescription, { foreignKey: 'prescriptionId' });

Medicine.hasMany(PrescriptionMedicine, { foreignKey: 'medicineId' });
PrescriptionMedicine.belongsTo(Medicine, { foreignKey: 'medicineId' });

// LabTest Relationships  
Patient.hasMany(LabTest, { foreignKey: 'patientId', onDelete: 'CASCADE' });
LabTest.belongsTo(Patient, { foreignKey: 'patientId' });

Doctor.hasMany(LabTest, { foreignKey: 'doctorId' });
LabTest.belongsTo(Doctor, { foreignKey: 'doctorId' });

// LabTest -> LabTestCatalog (N:1)
LabTestCatalog.hasMany(LabTest, { foreignKey: 'labTestCatalogId' });
LabTest.belongsTo(LabTestCatalog, { foreignKey: 'labTestCatalogId' });

// Bill Relationships
Patient.hasMany(Bill, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Bill.belongsTo(Patient, { foreignKey: 'patientId' });

Appointment.hasOne(Bill, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Bill.belongsTo(Appointment, { foreignKey: 'appointmentId' });

module.exports = {
    sequelize,
    User,
    Patient,
    Doctor,
    Department,
    Appointment,
    Prescription,
    LabTest,
    Bill,
    DoctorSchedule,
    Medicine,
    PrescriptionMedicine,
    LabTestCatalog
};
