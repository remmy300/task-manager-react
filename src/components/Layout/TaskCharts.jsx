import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { useContext } from "react";
import { TaskContext } from "@/context/TaskContext";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const TaskCharts = () => {
  const { tasks } = useContext(TaskContext);

  const statusCounts = tasks.reduce((acc, task) => {
    if (task.status) {
      acc[task.status] = (acc[task.status] || 0) + 1;
    }
    return acc;
  }, {});

  const priorityCounts = tasks.reduce((acc, task) => {
    if (task.priority) {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
    }
    return acc;
  }, {});

  const statusLabels =
    Object.keys(statusCounts).length > 0
      ? Object.keys(statusCounts)
      : ["No Data"];
  const statusValues =
    Object.values(statusCounts).length > 0 ? Object.values(statusCounts) : [0];

  const statusData = {
    labels: statusLabels,
    datasets: [
      {
        data: statusValues,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  const priorityData = {
    labels: Object.keys(priorityCounts),
    datasets: [
      {
        label: "Tasks by Priority",
        data: Object.values(priorityCounts),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div className="bg-white/90 p-4 rounded-lg shadow w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Task Status Distribution
        </h3>
        <div className="relative w-full aspect-square max-w-[400px] mx-auto">
          <Doughnut
            data={statusData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              cutout: "70%",
            }}
          />
        </div>
      </div>

      <div className="bg-white/90 p-4 rounded-lg shadow w-full">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Task Priority Levels
        </h3>
        <div className="relative w-full aspect-[4/3] max-w-[500px] mx-auto">
          <Bar
            data={priorityData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 },
                  grid: { display: false },
                },
                x: { grid: { display: false } },
              },
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCharts;
