import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';

import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload';
import { LoginResponse } from './interfaces/login-response';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {

  constructor( 
    @InjectModel( User.name)
    private userModel : Model<User>,
    private jwtService : JwtService
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    try{
      
      const { password, ...userData} = createUserDto

     const newUser = new this.userModel( {
        password: bcrypt.hashSync( password, 10),
        ...userData
      })
       await newUser.save();
        const { password: _, ...user} = newUser.toJSON();
    
    return user
     
    } catch (error) {
      if(error.code === 11000 )
      throw new BadRequestException(`${ createUserDto.email} already exists`)
    }
      throw new InternalServerErrorException('Something terrible happen')

    // 1- Encriptar la contraseña
    // 2- Guardar el usuario
    // 3- Generar el JSON web TOKEN
    // 4- manejar los errores
  }

  async register(registerDto: RegisterUserDto): Promise<LoginResponse>{
    const user = await this.create( registerDto)

    return {
      user: user,
      token: this.getJwToken({id : user._id})
    }
  }

  //* 1- Crear el usuario
  //* hacer return donde vamos a tener el token y el user
  //! en el controlador hay que cambiar la ruta '/register'
  //! crear el DTO podemos usar el mismo de create dto similares pero no iguales
  //* y en la parte del servicio reutilizar el metodo async create
  //* el objetivo es que al final al llamar al register : localhost:3000/auth/register tengamos la misma respuesta que el login 

  async login( loginDto: LoginDto): Promise<LoginResponse> {

    const { email, password } = loginDto

    const user = await this.userModel.findOne({ email })
    if ( !user) {
      throw new UnauthorizedException('Not valid credentials')
    }
    if (!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException('Wrong Password')
    }

    const { password:_, ...rest } = user.toJSON();
    return {
      user: rest,
      token: this.getJwToken( { id: user.id}),

    }

    /** Necesitamos retornar esta info aqui para el login
     * User { _id, name, email, roles,}
     * Token -> ASDASD.SDFSAD.ASDASFQW
     */
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwToken(payload: JwtPayload ){
    const token = this.jwtService.sign(payload)
    return token;
  }
}
