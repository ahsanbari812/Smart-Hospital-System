export const mockUsers = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@hospital.com',
        password: 'password123',
        role: 'admin',
    },
    {
        id: 2,
        name: 'Dr. John Doe',
        email: 'doctor@hospital.com',
        password: 'password123',
        role: 'doctor',
        specialization: 'Cardiology',
    },
    {
        id: 3,
        name: 'Jane Smith',
        email: 'patient@hospital.com',
        password: 'password123',
        role: 'patient',
    },
];

export const mockDoctors = [
    { id: 1, name: 'Dr. John Doe', specialization: 'Cardiology', department: 'Cardiology', status: 'Active' },
    { id: 2, name: 'Dr. Sarah Lee', specialization: 'Neurology', department: 'Neurology', status: 'Active' },
    { id: 3, name: 'Dr. Mike Brown', specialization: 'Pediatrics', department: 'Pediatrics', status: 'On Leave' },
];

export const mockPatients = [
    { id: 1, name: 'Jane Smith', age: 30, gender: 'Female', phone: '123-456-7890', lastVisit: '2023-10-01' },
    { id: 2, name: 'Bob Johnson', age: 45, gender: 'Male', phone: '987-654-3210', lastVisit: '2023-09-15' },
];

export const mockAppointments = [
    { id: 1, patientName: 'Jane Smith', doctorName: 'Dr. John Doe', date: '2023-10-27', time: '10:00 AM', status: 'Confirmed' },
    { id: 2, patientName: 'Bob Johnson', doctorName: 'Dr. Sarah Lee', date: '2023-10-28', time: '02:00 PM', status: 'Pending' },
];

export const mockStats = {
    patients: 1250,
    doctors: 45,
    appointments: 89,
    revenue: 54000,
};
