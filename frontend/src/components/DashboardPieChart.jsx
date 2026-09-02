import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell
} from "recharts";


const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f59e0b",
    "#ef4444"
];


function DashboardPieChart({
    title,
    data = []
}) {


    const total =
        data.length > 0
            ?
            Math.round(
                data.reduce(
                    (sum, item) =>
                        sum + Number(item.value),
                    0
                ) / data.length
            )
            :
            0;


    return (

        <div className="chart-card">


            <div className="chart-header">

                <h2>
                    {title}
                </h2>

            </div>



            {
                data.length === 0 ?

                    <div className="chart-empty">
                        No data available
                    </div>

                    :

                    <div className="donut-wrapper">


                        <PieChart
                            width={300}
                            height={260}
                        >


                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={100}
                                paddingAngle={4}
                                cx="50%"
                                cy="50%"
                            >


                                {
                                    data.map(
                                        (item, index) => (

                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[index % COLORS.length]
                                                }
                                            />

                                        )
                                    )
                                }


                            </Pie>


                            <Tooltip />


                            <Legend
                                verticalAlign="bottom"
                                height={40}
                            />


                        </PieChart>



                        <div className="chart-center">

                            <strong>
                                {total}%
                            </strong>

                            <span>
                                Average Progress
                            </span>

                        </div>



                    </div>

            }


        </div>

    );

}


export default DashboardPieChart;