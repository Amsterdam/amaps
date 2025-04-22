import { usePointQuery } from "./PointQueryContext";

const PointQueryResult = () => {
  const { result } = usePointQuery();

  return (
    <section style={{ padding: "1rem" }}>
      <h2 className="ams-heading ams-heading--4">Point query example</h2>
      <p>
        In this example clicking in the map will query an API, using that
        coordinate. It also uses information from the API to fill the search
        box. And searching an adress will select its location on the map.
      </p>
      <hr />
      {result ? (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      ) : (
        <p>
          <em>Try it out, the API results will appear below.</em>
        </p>
      )}
    </section>
  );
};

export default PointQueryResult;
