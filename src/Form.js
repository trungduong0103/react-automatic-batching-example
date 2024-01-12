import React from "react";
import { flushSync } from "react-dom";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const MOCK_API_URL =
  "https://632443f5bb2321cba9286589.mockapi.io/api/line_items";

async function getCats() {
  console.log("Call get cats promise");
  const response = await fetch(MOCK_API_URL);
  return await response.json();
}

async function anotherPromise() {
  return new Promise((resolve) => {
    console.log("Call another promise");
    resolve(true);
  });
}

function MyForm() {
  console.log("render");
  const queryClient = useQueryClient();
  const [fetchData, setFetchData] = React.useState(false);

  async function onValidWithAwait() {
    // Start
    console.log("Start querying");
    // await state setter to bail out of batching
    // https://github.com/reactwg/react-18/discussions/21
    await setFetchData(true);
    // fetching done
    console.log("Query done");
    setFetchData(false);
  }

  function onValidWithoutAwait() {
    // Start
    console.log("Start querying");
    setFetchData(true);
    // Form triggers a submit event, getCats is called
    // Calling setFetchData -> false here will be batched with previous state call
    // No API is called at all
    console.log("Query done");
    setFetchData(false);
  }

  function onValidWithFlushSync() {
    console.log("Start querying");
    flushSync(() => {
      setFetchData(true);
    });
    // React has updated the DOM by now
    console.log("Stop querying");
    setFetchData(false);
  }

  function onValidWithSettimeout() {
    console.log("Start querying");
    // We created a promise aka a microtask
    setFetchData(true);

    // Create a macrotask
    setTimeout(() => {
      console.log("Query done");
      setFetchData(false);
    }, 0);
  }

  const { isLoading, isFetched } = useQuery(["my-query"], () => getCats(), {
    enabled: fetchData,
    onSuccess: () => queryClient.invalidateQueries(["my-query"])
  });

  const { handleSubmit, reset } = useForm();

  return (
    <form onSubmit={handleSubmit(onValidWithSettimeout)} id="myform-id">
      <button style={{ marginRight: 5 }} type="submit" form="myform-id">
        Submit
      </button>
      <button onClick={() => reset()}>Reset</button>

      <br />
      <div>Is fetching data: {JSON.stringify(isLoading)}</div>
      <div>Is fetched data: {JSON.stringify(isFetched)}</div>
    </form>
  );
}

export default MyForm;
