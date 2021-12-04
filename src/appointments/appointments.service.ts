import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    createAppointmentDto.status = 'processing';
    const order = this.appointmentRepository.create(createAppointmentDto);
    try {
      const save = await this.appointmentRepository.save(order);
      return save;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findAll() {
    try {
      const appointments = await this.appointmentRepository.find();
      if (!appointments) {
        throw new NotFoundException('Order not found');
      }
      return appointments;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    try {
      await this.appointmentRepository.update(id, updateAppointmentDto);
      return true;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
