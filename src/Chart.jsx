import { Pie } from "react-chartjs-2";

const Chart = ({ data, options }) => {
  // const dataIn = data[0]; COMMENTED OUT
  // const optionsIn = options[0]; COMMENTED OUT
  // REMOVED onClick function

  return (
    <>
        <Pie data={data} />
    </>
  );
};

export default Chart;