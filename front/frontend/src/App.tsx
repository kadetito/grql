import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/config/Apollo";
import Layout from "./Layout";

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout />
    </ApolloProvider>
  );
}

export default App;
