const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: ".env" });

const crearToken = (usuario, secreta, expiresIn) => {
  console.log(usuario);
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id }, secreta, { expiresIn });
};

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRET);
      return usuarioId;
    },
  },
  Mutation: {
    nuevoUsuario: async (_, { input }, ctx) => {
      const { email, password } = input;

      //check if existe
      const existe = await Usuario.findOne({ email });
      console.log(existe);
      if (existe) {
        throw new Error("user ya registrado");
      }

      //hash pass
      const salt = await bcryptjs.genSaltSync(10);
      input.password = await bcryptjs.hashSync(password, salt);

      //save database
      try {
        const usuario = new Usuario(input);
        usuario.save();
        return usuario;
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      //Existe el user?
      const existe = await Usuario.findOne({ email });
      if (!existe) {
        throw new Error("user no existe");
      }
      //el password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existe.password
      );
      if (!passwordCorrecto) {
        throw new Error("El password es incorrecto");
      }
      //crear el token
      return {
        token: crearToken(existe, process.env.SECRET, "24h"),
      };
    },
  },
};

module.exports = resolvers;
