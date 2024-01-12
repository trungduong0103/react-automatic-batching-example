import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MyForm from "./Form";
import "./styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

export default function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <MyForm />
      </QueryClientProvider>
    </div>
  );
}
