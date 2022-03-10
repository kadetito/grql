import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useQuery, useMutation, gql } from "@apollo/client";
import { useState } from "react";

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Layout = () => {
  //Mutation
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const [mensaje, setMensaje] = useState("");

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("email no valido"),
      password: Yup.string(),
    }),
    onSubmit: async (valores) => {
      const { email, password } = valores;
      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: { email, password },
          },
        });
        setMensaje("Autenticado");
      } catch (error: any) {
        setMensaje(error.message.replace("GraphQL error: ", ""));
      }
    },
  });

  const mostrarmensaje = () => {
    return <p>{mensaje}</p>;
  };

  return (
    <div>
      {mensaje && mostrarmensaje()}
      <form onSubmit={formik.handleSubmit}>
        <p>
          {" "}
          <input
            name="email"
            id="email"
            type="text"
            onChange={formik.handleChange}
          />
        </p>
        <p>
          {" "}
          <input
            name="password"
            id="password"
            type="text"
            onChange={formik.handleChange}
          />
        </p>
        <p>
          <input name="boton" type="submit" value="send" />
        </p>
      </form>
    </div>
  );
};

export default Layout;
