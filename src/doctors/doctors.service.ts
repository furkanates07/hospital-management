import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor, DoctorDocument } from './schemas/doctor.schema';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name) private doctorModel: Model<DoctorDocument>,
  ) {}

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const hashedPassword = await bcrypt.hash(createDoctorDto.password, 10);
    createDoctorDto.password = hashedPassword;

    const doctor = new this.doctorModel(createDoctorDto);
    return doctor.save();
  }

  async findAll(): Promise<Doctor[]> {
    return this.doctorModel.find().exec();
  }

  async findById(id: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findById(id).exec();
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async getDoctorByEmail(email: string): Promise<Doctor> {
    const doctor = await this.doctorModel.findOne({ email }).exec();

    if (!doctor) {
      throw new NotFoundException(`Doctor with email ${email} not found`);
    }

    return doctor;
  }

  async findBySpeciality(speciality: string): Promise<Doctor[]> {
    return this.doctorModel.find({ speciality }).exec();
  }

  async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const updatedDoctor = await this.doctorModel.findByIdAndUpdate(
      id,
      updateDoctorDto,
      { new: true },
    );
    if (!updatedDoctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return updatedDoctor;
  }

  async remove(id: string): Promise<Doctor> {
    const deletedDoctor = await this.doctorModel.findByIdAndDelete(id);
    if (!deletedDoctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return deletedDoctor;
  }
}
