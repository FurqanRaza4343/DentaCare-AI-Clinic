export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  timings: string;
  image?: string;
}

export interface Appointment {
  id: number;
  user_id: number;
  doctor_id: number;
  doctor_name: string;
  service: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
}

export interface Package {
  id: string;
  name: string;
  items: string[];
  price: string;
  discount?: string;
}
